
export default function ErrorPage({error = "Something unexpected error occurred."}: {error?: string}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
                <div className="bg-red-100 text-red-800 p-4 rounded shadow-md">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            </div>
    );
}