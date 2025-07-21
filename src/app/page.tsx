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
        model: 'openrouter/openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }]
      }),
    });

    const data = await res.json();
    console.log('Response JSON:', data); // ← ADD THIS LINE

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">AI Startup Idea Generator</h1>

      <textarea
        className="w-full max-w-md p-3 border rounded-md mb-4"
        rows={4}
        placeholder="Describe your interest (e.g., 'AI for education')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={generateIdea}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 border rounded max-w-md whitespace-pre-line">
          {response}
        </div>
      )}
    </main>
  );
}
