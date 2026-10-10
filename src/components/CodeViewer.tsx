import React, { useState } from 'react';
import { ANDROID_SOURCE_FILES, AndroidFile } from '../androidSourceFiles';
import { Copy, Check, FileCode, Folder, Download, Terminal, CheckCircle2, ChevronRight } from 'lucide-react';
import { generateProjectZip, downloadBlob } from './ZipExporter';

export function CodeViewer() {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'manifest', label: 'Manifest & Security' },
    { id: 'gradle', label: 'Gradle Config' },
    { id: 'server', label: 'Ktor Daemon & Engine' },
    { id: 'interceptor', label: 'Tool Interceptor' },
    { id: 'ui', label: 'Jetpack Compose UI' },
    { id: 'service', label: 'Foreground Service' }
  ];

  const filteredFiles = filterCategory === 'all'
    ? ANDROID_SOURCE_FILES
    : ANDROID_SOURCE_FILES.filter(f => f.category === filterCategory);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setExportingZip(true);
      const zipBlob = await generateProjectZip();
      downloadBlob(zipBlob, 'SheetaLMApp-Android-Studio-Project.zip');
    } catch (e) {
      console.error('Failed to export ZIP', e);
    } finally {
      setExportingZip(false);
    }
  };

  const lines = selectedFile.code.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            Monolithic Android Codebase (Package: <span className="font-mono text-indigo-300">com.sheeta.lmapp</span>)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% production-ready Kotlin & XML without placeholders or TODO comments. Ready for Android Studio import.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={exportingZip}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exportingZip ? 'Creating ZIP...' : 'Export Complete Project (.ZIP)'}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              filterCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left File Tree, Right Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[560px] overflow-hidden">
        
        {/* Left File List */}
        <div className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950/30 overflow-y-auto max-h-[220px] lg:max-h-none p-2 space-y-1">
          {filteredFiles.map(file => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-slate-100 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    {file.path}
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 overflow-hidden">
          
          {/* File Header */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-xs font-mono font-medium text-indigo-300 truncate block">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-slate-400 truncate block">
                {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0 ml-3"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/90 select-text">
            <pre className="flex">
              {/* Line numbers */}
              <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 shrink-0 font-mono">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Code content */}
              <div className="pl-4 whitespace-pre overflow-x-auto text-slate-200">
                {lines.map((line, i) => (
                  <div key={i} className="hover:bg-slate-900/60 px-1 rounded">
                    {line || ' '}
                  </div>
                ))}
              </div>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
