import React from 'react';

const backgroundImage =
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80'; // Sad cat image

export const NotFoundPage: React.FC = () => (
    <div
        style={{
            minHeight: '100vh',
            background: `linear-gradient(rgba(30,30,30,0.7), rgba(30,30,30,0.7)), url(${backgroundImage}) center/cover no-repeat`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
        }}
    >
        <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
        <h2 style={{ fontWeight: 400, margin: '1rem 0' }}>Page Not Found</h2>
        <p style={{ fontSize: '1.25rem', maxWidth: 400, textAlign: 'center', marginBottom: '2rem' }}>
            Sorry, we couldn't find the page you're looking for. Even this dog is sad about it.
        </p>
        <a
            href="/login"
            style={{
                padding: '0.75rem 2rem',
                background: '#fff',
                color: '#333',
                borderRadius: '2rem',
                textDecoration: 'none',
                fontWeight: 600,
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                transition: 'background 0.2s, color 0.2s',
            }}
        >
            Go Home
        </a>
    </div>
);

export default NotFoundPage;