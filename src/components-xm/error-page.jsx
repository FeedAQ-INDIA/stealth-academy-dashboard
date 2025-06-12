import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <h1 className="text-9xl font-extrabold text-gray-400 tracking-widest">404</h1>
            <div className="bg-red-500 px-2 text-sm text-white rounded rotate-12 absolute">Error</div>

            <h2 className="mt-8 text-3xl font-semibold text-gray-700">Oops! Something went wrong.</h2>
            <p className="mt-4 text-gray-500">
                {error.statusText || error.message || "Sorry, an unexpected error has occurred."}
            </p>

            <a
                href="/"
                className="mt-6 inline-block px-6 py-3 text-sm font-medium text-black bg-[#ffdd00] rounded hover:bg-yellow-200 transition"
            >
                Go to Homepage
            </a>
        </div>
    );
}
