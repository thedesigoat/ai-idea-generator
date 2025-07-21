'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateIdea() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aiideagenerator.vercel.app',
          'X-Title': 'AI Idea Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [{ role: 'user', content: input }],
        }),
      });

      const data = await res.json();
      if (!data.choices || !data.choices[0]) {
        setResponse('⚠️ No valid response from AI.');
      } else {
        setResponse(data.choices[0].message.content);
      }
    } catch (err) {
      console.error(err);
      setResponse('❌ Error contacting AI.');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🚀 AI Startup Idea Generator
        </h1>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={4}
          placeholder="Describe your interest (e.g., 'AI for education')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateIdea}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Idea'}
        </button>

        {response && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg border text-gray-800 whitespace-pre-line">
            {response}
          </div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        Made with 💡 using OpenRouter & Next.js
      </footer>
    </main>
  );
}
