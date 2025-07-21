'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateIdea() {
    if (!input) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aiideagenerator.vercel.app',
          'X-Title': 'AI Idea Generator'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [{ role: 'user', content: input }]
        }),
      });

      const data = await res.json();
      console.log('Response JSON:', data);

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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          🚀 AI Startup Idea Generator
        </h1>

        <textarea
          className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Describe your interest (e.g., 'AI for education')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateIdea}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-200 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Idea'}
        </button>

        {response && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm whitespace-pre-line text-gray-800">
            {response}
          </div>
        )}
      </div>
    </main>
  );
}
