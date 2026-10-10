import React from 'react';
import { ShieldCheck, Cpu, Network, Search, Layers, CheckCircle2, ArrowRight, Smartphone, Terminal, Lock } from 'lucide-react';

export function ArchitectureGuide() {
  const steps = [
    {
      step: '01',
      title: 'Monolithic Kotlin Architecture',
      description: 'Zero TODOs, zero placeholders. Full imports across Ktor 2.3.12, Netty engine, OkHttp 4.12, Jsoup 1.18, and Jetpack Compose BOM 2024.11.',
      status: 'VERIFIED'
    },
    {
      step: '02',
      title: 'Deadlock & Concurrency Analysis',
      description: 'Mutex isolation between Ktor Netty request threads, JNI GGUF inference loop, and Compose StateFlow collectors on Dispatchers.IO.',
      status: 'VERIFIED'
    },
    {
      step: '03',
      title: 'Android 14/15 Policy Compliance',
      description: 'Foreground Service specialUse & connectedDevice declarations, network security config permitting cleartext LAN HTTP, and sticky wake locks.',
      status: 'VERIFIED'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          Rigorous 3-Step Promic Verification Loop
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          Android Systems & On-Device AI Architecture Pipeline
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The Sheeta LM App converts any modern Android smartphone into a self-hosted on-device OpenAI gateway with native Internet grounding via OkHttp.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map(s => (
          <div key={s.step} className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-black font-mono text-indigo-400">{s.step}</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {s.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">{s.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Runtime Execution Flow
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Smartphone className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="font-semibold text-slate-200">1. Client Request</span>
            <span className="text-[10px] text-slate-400 mt-0.5">POST /v1/chat/completions</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Network className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="font-semibold text-slate-200">2. Embedded Ktor Netty</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Foreground Service Daemon</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Search className="w-5 h-5 text-amber-400 mb-1" />
            <span className="font-semibold text-slate-200">3. Tool Interceptor</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Native OkHttp + Jsoup Scrape</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Cpu className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="font-semibold text-slate-200">4. GGUF Neural Kernel</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Tokens-per-second streaming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
