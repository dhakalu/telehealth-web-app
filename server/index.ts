import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequestHandler, type RequestHandler } from '@remix-run/express'
import { installGlobals, type ServerBuild } from '@remix-run/node'
import { ip as ipAddress } from 'address'
import chalk from 'chalk'
import closeWithGrace from 'close-with-grace'
import compression from 'compression'
import express from 'express'
import 'express-async-errors'
import getPort, { portNumbers } from 'get-port'
import helmet from 'helmet'
import morgan from 'morgan'
import onFinished from 'on-finished'
import serverTiming from 'server-timing'
import sourceMapSupport from 'source-map-support'

sourceMapSupport.install()
installGlobals()

const viteDevServer =
	process.env.NODE_ENV === 'production'
		? undefined
		: await import('vite').then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			)

const getBuild = async (): Promise<ServerBuild> => {
	if (viteDevServer) {
		return viteDevServer.ssrLoadModule('virtual:remix/server-build') as any
	}
	// @ts-ignore (this file may or may not exist yet)
	return import('../build/server/index.js') as Promise<ServerBuild>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const here = (...d: Array<string>) => path.join(__dirname, ...d)
const getHost = (req: { get: (key: string) => string | undefined }) =>
	req.get('X-Forwarded-Host') ?? req.get('host') ?? ''

const MODE = process.env.NODE_ENV

if (MODE === 'production' && process.env.SENTRY_DSN) {
	// todo add monitoring
    // void import('./utils/monitoring.js').then(({ init }) => init())
}

const app = express()
app.use(serverTiming())


// TODO: remove this once all clients are updated
app.post('/__metronome', (req: any, res: any) => {
	res.status(503)
	return res.send('Metronome is deprecated and no longer in use.')
})

app.use(async (req, res, next) => {
	res.set('X-Frame-Options', 'SAMEORIGIN')
	const proto = req.get('X-Forwarded-Proto') ?? req.protocol

	const host = getHost(req)

	res.set('Access-Control-Allow-Origin', `${proto}://${host}`)

	// if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
	res.set('Strict-Transport-Security', `max-age=${60 * 60 * 24 * 365 * 100}`)
	next()
})

app.use((req, res, next) => {
	const proto = req.get('X-Forwarded-Proto')
	const host = getHost(req)
	if (proto === 'http') {
		res.set('X-Forwarded-Proto', 'https')
		res.redirect(`https://${host}${req.originalUrl}`)
		return
	}
	next()
})


// Redirect trailing slashes to non-trailing slashes
// except for the root path
app.use((req, res, next) => {
	if (req.path.endsWith('/') && req.path.length > 1) {
		const query = req.url.slice(req.path.length)
		const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
		res.redirect(301, safepath + query)
	} else {
		next()
	}
})

app.use(compression())

const publicAbsolutePath = here('../build/client')

if (viteDevServer) {
	app.use(viteDevServer.middlewares)
} else {
	app.use(
		express.static(publicAbsolutePath, {
			maxAge: '1w',
			setHeaders(res, resourcePath) {
				const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, '')
				if (relativePath.startsWith('build/info.json')) {
					res.setHeader('cache-control', 'no-cache')
					return
				}
				// If we ever change our font (which we quite possibly never will)
				// then we'll just want to change the filename or something...
				// Remix fingerprints its assets so we can cache forever
				if (
					relativePath.startsWith('fonts') ||
					relativePath.startsWith('build')
				) {
					res.setHeader('cache-control', 'public, max-age=31536000, immutable')
				}
			},
		}),
	)
}

app.get(
	['/build/*', '/images/*', '/fonts/*', '/favicons/*'],
	(req: any, res: any) => {
		// if we made it past the express.static for /build, then we're missing something. No bueno.
		return res.status(404).send('Not found')
	},
)

// log the referrer for 404s
app.use((req, res, next) => {
	onFinished(res, () => {
		const referrer = req.get('referer')
		if (res.statusCode === 404 && referrer) {
			console.info(
				`👻 404 on ${req.method} ${req.path} referred by: ${referrer}`,
			)
		}
	})
	next()
})
// set up morgan logging
app.use(
	morgan(
		(tokens, req, res) => {
			try {
				const host = getHost(req)
				return [
					tokens.method?.(req, res),
					`${host}${decodeURIComponent(tokens.url?.(req, res) ?? '')}`,
					tokens.status?.(req, res),
					tokens.res?.(req, res, 'content-length'),
					'-',
					tokens['response-time']?.(req, res),
					'ms',
				].join(' ')
			} catch (error: unknown) {
				console.error(
					`Error generating morgan log line`,
					error,
					req.originalUrl,
				)
				return ''
			}
		},
		{
			skip: (req, res) => {
				if (res.statusCode !== 200) return false
				// skip health check related requests
				const headToRoot = req.method === 'HEAD' && req.originalUrl === '/'
				const getToHealthcheck =
					req.method === 'GET' && req.originalUrl === '/healthcheck'
				return headToRoot || getToHealthcheck
			},
		},
	),
)

app.use((_, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
	next()
})

app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
		contentSecurityPolicy: {
			directives: {
				'connect-src': [
					...(MODE === 'development' ? ['ws:'] : []),
					"'self'",
				].filter(Boolean),
				'font-src': ["'self'"],
				'frame-src': [
					"'self'",
					'youtube.com',
					'www.youtube.com',
					'youtu.be',
					'youtube-nocookie.com',
					'www.youtube-nocookie.com',
				],
				'img-src': [
					"'self'",
					'data:',
					'images.unsplash.com',
				],
				'media-src': [
					"'self'",
					'data:',
					'blob:',
				],
				'script-src': [
					"'unsafe-inline'",
					// "'strict-dynamic'",
					"'unsafe-eval'",
					"'self'",
					// (req, res) => `'nonce-${res.locals.cspNonce}'`,
				],
				'script-src-attr': [
					"'unsafe-inline'",
					// TODO: figure out how to make the nonce work instead of
					// unsafe-inline. I tried adding a nonce attribute where we're using
					// inline attributes, but that didn't work. I still got that it
					// violated the CSP.
				],
				'upgrade-insecure-requests': null,
			},
		},
	}),
)

// CORS support for /.well-known/*
app.options('/.well-known/*', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		req.header('Access-Control-Request-Headers') || '*',
	)
	res.sendStatus(204)
})

app.use('/.well-known/*', (_, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	next()
})

async function getRequestHandler(): Promise<RequestHandler> {
	function getLoadContext(req: any, res: any) {
		return { cspNonce: res.locals.cspNonce }
	}
	return createRequestHandler({
		build: MODE === 'development' ? getBuild : await getBuild(),
		mode: MODE,
		getLoadContext,
	})
}

app.all('*', await getRequestHandler())

const desiredPort = Number(process.env.PORT || 3000)
const portToUse = await getPort({
	port: portNumbers(desiredPort, desiredPort + 100),
})

const server = app.listen(portToUse, () => {
	const addy = server.address()
	const portUsed =
		desiredPort === portToUse
			? desiredPort
			: addy && typeof addy === 'object'
				? addy.port
				: 0

	if (portUsed !== desiredPort) {
		console.warn(
			chalk.yellow(
				`⚠️  Port ${desiredPort} is not available, using ${portUsed} instead.`,
			),
		)
	}
	console.log(`\n🐨  let's get rolling!`)
	const localUrl = `http://localhost:${portUsed}`
	let lanUrl: string | null = null
	const localIp = ipAddress() ?? 'Unknown'
	// Check if the address is a private ip
	// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
	// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
	if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
		lanUrl = `http://${localIp}:${portUsed}`
	}

	console.log(
		`
${chalk.bold('Local:')}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold('On Your Network:')}  ${chalk.cyan(lanUrl)}` : ''}
${chalk.bold('Press Ctrl+C to stop')}
		`.trim(),
	)
})

// let wss: WebSocketServer | undefined
// if (process.env.NODE_ENV === 'development') {
// 	try {
// 		const { contentWatcher } = await import('./content-watcher.js')
// 		wss = contentWatcher(server)
// 	} catch (error: unknown) {
// 		console.error('unable to start content watcher', error)
// 	}
// }

closeWithGrace(() => {
	return Promise.all([
		new Promise((resolve, reject) => {
			server.close((e) => (e ? reject(e) : resolve('ok')))
		}),
		// new Promise((resolve, reject) => {
		// 	wss?.close((e) => (e ? reject(e) : resolve('ok')))
		// }),
	])
})

/*
eslint
  @typescript-eslint/ban-ts-comment: "off",
  @typescript-eslint/prefer-ts-expect-error: "off",
  @typescript-eslint/no-shadow: "off",
  import/namespace: "off",
  no-inner-declarations: "off",
*/