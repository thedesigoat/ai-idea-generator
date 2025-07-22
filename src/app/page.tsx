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

      // Check for non-2xx HTTP status
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error response:', errorText);
        setResponse(`❌ API returned an error: ${res.status}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('Response JSON:', data);

      // Check for API-level error
      if (data.error) {
        setResponse(`❌ API Error: ${data.error.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Check if choices are valid
      if (!data.choices || !data.choices[0]?.message?.content) {
        setResponse('⚠️ No valid response from AI.');
        setLoading(false);
        return;
      }

      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error('Fetch exception:', err);
      setResponse('❌ Error contacting AI.');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">AI Startup Idea Generator</h1>

      <textarea
        className="w-full max-w-md p-3 border border-gray-700 bg-gray-800 text-white rounded-md mb-4"
        rows={4}
        placeholder="Describe your interest (e.g., 'AI for education')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={generateIdea}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-800 text-gray-200 border border-gray-700 rounded max-w-md whitespace-pre-line">
          {response}
        </div>
      )}
    </main>
  );
}
