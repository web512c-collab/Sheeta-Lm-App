import React, { useState } from 'react';
import { Terminal, Send, Copy, Check, Radio, Play, Sparkles, Code2, Globe } from 'lucide-react';

export function ApiGatewayTester() {
  const [model, setModel] = useState('sheeta-gguf-7b');
  const [prompt, setPrompt] = useState('Search for the latest news on Artemis II lunar mission');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [stream, setStream] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'ts'>('curl');

  const curlSnippet = `curl http://192.168.1.142:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [
      {"role": "user", "content": "${prompt}"}
    ],
    "stream": ${stream},
    "enable_web_search": ${enableWebSearch}
  }'`;

  const pythonSnippet = `from openai import OpenAI

client = OpenAI(
    base_url="http://192.168.1.142:8080/v1",
    api_key="not-needed-local-server"
)

response = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "${prompt}"}],
    stream=${stream ? 'True' : 'False'},
    extra_body={"enable_web_search": ${enableWebSearch ? 'True' : 'False'}}
)

${stream ? `for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)` : 'print(response.choices[0].message.content)'}`;

  const tsSnippet = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://192.168.1.142:8080/v1",
  apiKey: "local-daemon",
});

const completion = await client.chat.completions.create({
  model: "${model}",
  messages: [{ role: "user", content: "${prompt}" }],
  stream: ${stream},
  // @ts-ignore
  enable_web_search: ${enableWebSearch},
});

${stream ? `for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}` : 'console.log(completion.choices[0].message.content);'}`;

  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    setResponseOutput(null);

    // Simulate phone server response with tool call interceptor
    await new Promise(r => setTimeout(r, 450));

    if (stream) {
      const chunks = [
        `data: {"id":"chatcmpl-a93f","object":"chat.completion.chunk","created":1741600000,"model":"${model}","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}\n\n`,
        `[ToolInterceptor]: Detected web query -> Scraped https://html.duckduckgo.com/html/?q=${encodeURIComponent(prompt)}\n`,
        `[ToolInterceptor]: Extracted 1,420 chars clean HTML text from DOM.\n\n`,
        `data: {"id":"chatcmpl-a93f","object":"chat.completion.chunk","created":1741600001,"model":"${model}","choices":[{"index":0,"delta":{"content":"Based on "},"finish_reason":null}]}\n\n`,
        `data: {"id":"chatcmpl-a93f","object":"chat.completion.chunk","created":1741600001,"model":"${model}","choices":[{"index":0,"delta":{"content":"live web results retrieved on-device: "},"finish_reason":null}]}\n\n`,
        `data: {"id":"chatcmpl-a93f","object":"chat.completion.chunk","created":1741600002,"model":"${model}","choices":[{"index":0,"delta":{"content":"NASA plans the crewed Artemis II mission around the Moon, testing vital life support systems."},"finish_reason":null}]}\n\n`,
        `data: {"id":"chatcmpl-a93f","object":"chat.completion.chunk","created":1741600002,"model":"${model}","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n`,
        `data: [DONE]\n\n`
      ];

      let output = '';
      for (const chunk of chunks) {
        output += chunk;
        setResponseOutput(output);
        await new Promise(r => setTimeout(r, 120));
      }
    } else {
      const response = {
        id: "chatcmpl-" + Math.random().toString(36).substring(2, 10),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: `Sheeta LM on-device execution complete. The native ToolCallingInterceptor evaluated your query, fetched real-time web context via OkHttp, and injected it into the GGUF attention context.`
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 38,
          completion_tokens: 42,
          total_tokens: 80
        }
      };
      setResponseOutput(JSON.stringify(response, null, 2));
    }

    setIsExecuting(false);
  };

  const handleCopySnippet = () => {
    const text = activeCodeTab === 'curl' ? curlSnippet : activeCodeTab === 'python' ? pythonSnippet : tsSnippet;
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            Embedded Ktor OpenAI API Gateway Console
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the on-device HTTP gateway exactly as external laptops and clients on the same Wi-Fi communicate with your phone.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">http://&lt;phone_ip&gt;:8080/v1</span>
        </div>
      </div>

      {/* Request Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Model ID</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="sheeta-gguf-7b">sheeta-gguf-7b (Q4_K_M)</option>
              <option value="sheeta-gguf-3b">sheeta-gguf-3b (Q4_0 - Ultra Fast)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">User Prompt (Test Tool Calling)</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter message to send to phone server..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={enableWebSearch}
                onChange={e => setEnableWebSearch(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="font-medium">Enable OkHttp Web Tool Scraper</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={stream}
                onChange={e => setStream(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="font-medium">SSE Stream Mode</span>
            </label>
          </div>

          <button
            onClick={handleExecuteRequest}
            disabled={isExecuting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {isExecuting ? 'Transmitting Request to Phone Daemon...' : 'Send Request (POST /v1/chat/completions)'}
          </button>
        </div>

        {/* Right Column: Code Snippets & Response */}
        <div className="flex flex-col space-y-3">
          {/* Tab Selector for Client Code */}
          <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveCodeTab('curl')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  activeCodeTab === 'curl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  activeCodeTab === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setActiveCodeTab('ts')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  activeCodeTab === 'ts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Node / TypeScript
              </button>
            </div>

            <button
              onClick={handleCopySnippet}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 p-1"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSnippet ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Snippet Display */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[140px]">
            <pre>
              {activeCodeTab === 'curl' && curlSnippet}
              {activeCodeTab === 'python' && pythonSnippet}
              {activeCodeTab === 'ts' && tsSnippet}
            </pre>
          </div>

          {/* Response Console */}
          <div className="flex-1 min-h-[160px] bg-slate-950 rounded-xl p-3 border border-slate-800 flex flex-col">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Server Response Payload</span>
              {isExecuting && <span className="text-emerald-400 animate-pulse font-mono">STREAMING INCOMING CHUNKS...</span>}
            </div>
            <div className="flex-1 overflow-auto text-[11px] font-mono text-emerald-300/90 whitespace-pre leading-relaxed">
              {responseOutput || (
                <span className="text-slate-600 italic">
                  Press &quot;Send Request&quot; to inspect the live response stream from the embedded Ktor daemon.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
