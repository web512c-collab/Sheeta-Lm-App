import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Battery,
  Play,
  Square,
  Copy,
  Check,
  Send,
  Trash2,
  HardDrive,
  Settings,
  X,
  Search,
  FolderOpen,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

interface ModelOption {
  name: string;
  filename: string;
  size: string;
  location: string;
  storageType: 'sdcard' | 'internal' | 'downloads';
  quantization: string;
}

const SAMPLE_STORAGE_MODELS: ModelOption[] = [
  {
    name: 'Qwen 2.5 1.5B Instruct',
    filename: 'qwen2.5-1.5b-instruct-q4_k_m.gguf',
    size: '1.1 GB',
    location: 'كارت الميموري (SD Card / AI_Models/)',
    storageType: 'sdcard',
    quantization: 'Q4_K_M'
  },
  {
    name: 'Llama 3.2 3B Instruct',
    filename: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    size: '2.0 GB',
    location: 'الذاكرة الداخلية (Internal Storage / Documents/)',
    storageType: 'internal',
    quantization: 'Q4_K_M'
  },
  {
    name: 'Llama 3.2 1B Ultra Fast',
    filename: 'Llama-3.2-1B-Instruct-Q4_0.gguf',
    size: '790 MB',
    location: 'كارت الميموري (SD Card / Models/)',
    storageType: 'sdcard',
    quantization: 'Q4_0'
  },
  {
    name: 'DeepSeek R1 Distill Qwen 1.5B',
    filename: 'DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf',
    size: '1.15 GB',
    location: 'مجلد التنزيلات (Downloads/)',
    storageType: 'downloads',
    quantization: 'Q4_K_M'
  }
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  speed?: string;
  toolUsed?: string;
}

export function AndroidEmulator() {
  // Theme state: Responds dynamically to Android System Theme (Light / Dark)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Model state (ChatterUI style: Direct Zero-Copy pointer)
  const [selectedModel, setSelectedModel] = useState<ModelOption>(SAMPLE_STORAGE_MODELS[0]);
  const [showFilePickerModal, setShowFilePickerModal] = useState(false);
  const [showServerDialog, setShowServerDialog] = useState(false);

  // Server state
  const [isRunning, setIsRunning] = useState(true);
  const [phoneIp, setPhoneIp] = useState('192.168.1.142');
  const [port, setPort] = useState(8080);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // Chat state
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً بك! الواجهة الآن خفيفة وبسيطة جداً وتستجيب تلقائياً لوضع النظام (لايت مود / دارك مود).\nالنموذج جاهز للعمل من كارت الميموري بدون أي نسخ.',
      time: '10:48 AM',
      speed: '52 tok/s'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isDark = systemTheme === 'dark';

  const handleCopyGatewayUrl = () => {
    navigator.clipboard.writeText(`http://${phoneIp}:${port}/v1`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSelectModel = (model: ModelOption) => {
    setSelectedModel(model);
    setShowFilePickerModal(false);
    const switchMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `تم اختيار "${model.name}" (${model.size}) مباشرة من: ${model.location}.\nالملف مفتوح بأسلوب Zero-Copy دون استهلاك مساحة جديدة!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      speed: 'Ready'
    };
    setMessages(prev => [...prev, switchMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isGenerating) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    const isWebQuery = webSearchEnabled && (
      text.toLowerCase().includes('اخبار') ||
      text.toLowerCase().includes('news') ||
      text.toLowerCase().includes('طقس') ||
      text.toLowerCase().includes('سعر') ||
      text.toLowerCase().includes('اليوم')
    );

    const assistantId = (Date.now() + 1).toString();
    const finalContent = isWebQuery
      ? `بناءً على نتائج البحث التي جلبها متصفح OkHttp المدمج:\n\nتم تحديث الإجابة حول "${text}" بمعلومات حية، وضخها مباشرة في النموذج المحلي (${selectedModel.name}).`
      : `تمت معالجة سؤالك محلياً بالكامل على معالج هاتفك بواسطة نموذج (${selectedModel.name}) بدون أي خوادم خارجية وبخصوصية كاملة.`;

    const words = finalContent.split(' ');
    let currentWords = '';

    setMessages(prev => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speed: '46.8 tok/s',
        toolUsed: isWebQuery ? 'بحث الويب' : undefined
      }
    ]);

    for (let i = 0; i < words.length; i++) {
      currentWords += (i === 0 ? '' : ' ') + words[i];
      const snapshot = currentWords;
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: snapshot } : m));
      await new Promise(r => setTimeout(r, 24));
    }

    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 space-y-3">
      
      {/* System Theme Controller Pill */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 shadow-md">
        <span className="text-[11px] text-slate-400 px-2.5 font-medium">وضع نظام أندرويد (System Theme):</span>
        <button
          onClick={() => setSystemTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
            systemTheme === 'light'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>لايت مود (Light)</span>
        </button>
        <button
          onClick={() => setSystemTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
            systemTheme === 'dark'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>دارك مود (Dark)</span>
        </button>
      </div>

      {/* Device Frame */}
      <div className={`relative w-[380px] sm:w-[410px] h-[810px] rounded-[48px] p-3 shadow-2xl border-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 border-slate-700/80' : 'bg-slate-300 border-slate-400/80 shadow-slate-900/10'
      }`}>
        
        {/* Hardware side buttons */}
        <div className={`absolute -left-[7px] top-[140px] w-[5px] h-12 rounded-l-md ${isDark ? 'bg-slate-700' : 'bg-slate-400'}`} />
        <div className={`absolute -left-[7px] top-[210px] w-[5px] h-12 rounded-l-md ${isDark ? 'bg-slate-700' : 'bg-slate-400'}`} />
        <div className="absolute -right-[7px] top-[170px] w-[5px] h-16 bg-indigo-500/90 rounded-r-md" />

        {/* Inner Phone Screen */}
        <div className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-colors duration-300 select-none ${
          isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          
          {/* Top Notch / Dynamic Island */}
          <div className={`h-7 flex items-center justify-between px-6 z-30 shrink-0 transition-colors ${
            isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-200/90 text-slate-700'
          }`}>
            <span className="text-[11px] font-semibold">10:50</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-xs">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <Battery className="w-3.5 h-3.5 opacity-80" />
            </div>
          </div>

          {/* Ultra-Simple ChatterUI Top Bar */}
          <div className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 z-20 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            
            {/* Center/Left: Model Selector Button */}
            <button
              onClick={() => setShowFilePickerModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition group max-w-[240px] truncate ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200/70'
              }`}
              title="اضغط لاختيار نموذج GGUF من الذاكرة أو كارت الميموري"
            >
              <FolderOpen className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="truncate text-right">
                <span className="text-xs font-bold block truncate">{selectedModel.name}</span>
                <span className={`text-[9px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedModel.size} &bull; كارت الميموري
                </span>
              </div>
            </button>

            {/* Right: Quick Server Status & Connect Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowServerDialog(true)}
                className={`p-2 rounded-xl border relative transition ${
                  isRunning
                    ? isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
                title="السيرفر المحلي"
              >
                <Wifi className="w-4 h-4" />
                {isRunning && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => setMessages([])}
                className={`p-2 rounded-xl border transition ${
                  isDark ? 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean Conversational Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-60">
                <FolderOpen className="w-10 h-10 text-indigo-500" />
                <p className="text-sm font-semibold">المحادثة فارغة</p>
                <p className="text-xs">
                  النموذج جاهز في الذاكرة. اكتب أي سؤال في الأسفل للبدء فوراً.
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-3 text-xs leading-relaxed whitespace-pre-wrap transition-all shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : isDark
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-xs'
                          : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {msg.content || (
                        <span className="inline-flex gap-1 py-1">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] opacity-60">
                      <span>{msg.time}</span>
                      {msg.speed && <span>&bull; {msg.speed}</span>}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ultra-Clean Bottom Input Bar */}
          <div className={`p-3 border-t flex items-center gap-2 shrink-0 z-10 transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`p-2.5 rounded-2xl border transition ${
                webSearchEnabled
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
              title={webSearchEnabled ? 'بحث الويب مفعّل' : 'بحث الويب معطل'}
            >
              <Search className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالتك للنموذج..."
              disabled={isGenerating}
              className={`flex-1 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isGenerating || !inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl disabled:opacity-40 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Android Home Navigation Bar */}
          <div className={`h-4 flex items-center justify-center shrink-0 transition-colors ${
            isDark ? 'bg-slate-950' : 'bg-white'
          }`}>
            <div className={`w-28 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
          </div>

          {/* MODAL: Simple Document Picker (ChatterUI SAF Flow) */}
          {showFilePickerModal && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 flex flex-col justify-end animate-fadeIn">
              <div className={`border-t rounded-t-[32px] p-5 max-h-[85%] flex flex-col space-y-3 shadow-2xl transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/20">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-indigo-500" />
                      اختر ملف النموذج من الهاتف أو كارت الميموري
                    </h3>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      يعمل مباشرة من مكانه بدون نسخ أو زيادة مساحة
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFilePickerModal(false)}
                    className="p-1.5 rounded-lg bg-slate-500/10 hover:bg-slate-500/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[360px]">
                  {SAMPLE_STORAGE_MODELS.map((m, idx) => {
                    const isCurrent = m.filename === selectedModel.filename;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectModel(m)}
                        className={`w-full text-right p-3 rounded-2xl border transition flex items-center justify-between gap-2 ${
                          isCurrent
                            ? 'bg-indigo-600/15 border-indigo-500 text-indigo-600 font-semibold'
                            : isDark
                            ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {m.name}
                          </div>
                          <div className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {m.location}
                          </div>
                          <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                            الحجم: {m.size}
                          </div>
                        </div>

                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className={`text-[11px] px-2 py-1 rounded-lg border shrink-0 ${
                            isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'
                          }`}>
                            تحديد
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DIALOG: Local Server Info */}
          {showServerDialog && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 flex items-center justify-center p-4 animate-fadeIn">
              <div className={`rounded-3xl p-5 w-full max-w-[340px] space-y-4 shadow-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    السيرفر المحلي (Local Gateway)
                  </h3>
                  <button
                    onClick={() => setShowServerDialog(false)}
                    className="p-1 rounded-lg bg-slate-500/10 hover:bg-slate-500/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <code className="text-xs font-mono font-semibold text-indigo-500 truncate">
                    http://{phoneIp}:{port}/v1
                  </code>
                  <button
                    onClick={handleCopyGatewayUrl}
                    className="p-1.5 rounded-lg bg-indigo-600 text-white text-xs flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'تم' : 'نسخ'}</span>
                  </button>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  يمكن لأي جهاز على نفس شبكة الواي فاي (مثل الكمبيوتر أو Cursor) استخدام هاتفك كـ OpenAI API Gateway.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                      isRunning
                        ? 'bg-rose-500/15 text-rose-500 border border-rose-300/40 hover:bg-rose-500/25'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {isRunning ? 'إيقاف السيرفر' : 'تشغيل السيرفر'}
                  </button>
                  <button
                    onClick={() => setShowServerDialog(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border ${
                      isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
