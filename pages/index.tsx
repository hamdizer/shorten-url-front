import React, { useState } from "react";
import axios from "axios";

// This is the main page component
export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shorten`,
        { originalUrl }
      );
      setResult(response.data.shortenedUrl);
      setError(null);
    } catch (err) {
      setError("An error occurred while shortening the URL");
      console.log(err);
      setResult(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-center text-xl font-semibold mb-4">
          URL Shortener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Shorten URL
          </button>
        </form>

        {result && (
          <div className="mt-4 text-center">
            <p className="font-medium">Shortened URL:</p>
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {result}
            </a>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
