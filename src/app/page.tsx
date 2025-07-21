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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          💡 AI Startup Idea Generator
        </h1>

        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition mb-6"
          rows={5}
          placeholder="Describe your interest (e.g., 'AI for education')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateIdea}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Idea'}
        </button>

        {response && (
          <div className="mt-8 p-5 bg-gray-100 border border-gray-200 rounded-xl shadow-inner whitespace-pre-line text-gray-800">
            {response}
          </div>
        )}
      </div>
    </main>
  );
}
