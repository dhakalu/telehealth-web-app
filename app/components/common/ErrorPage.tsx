
export default function ErrorPage({ error = "Something unexpected error occurred." }: { error?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center  p-8">
            <div className="bg-destructive text-destructive p-4 rounded shadow-md">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
            </div>
        </div>
    );
}