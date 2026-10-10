import React, { useState } from 'react';
import {
  FolderOpen,
  Copy,
  Check,
  Terminal,
  Upload,
  HardDrive,
  Download,
  Cpu,
  Info,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  FileBox,
  Smartphone
} from 'lucide-react';

export function LocalModelsGuide() {
  const [copiedPath, setCopiedPath] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [copiedAdbPull, setCopiedAdbPull] = useState(false);
  const [selectedModel, setSelectedModel] = useState('qwen2.5-1.5b-instruct-q4_k_m.gguf');

  const modelsDirectoryPath = '/sdcard/Android/data/com.sheeta.lmapp/files/models/';
  const fullSystemPath = '/storage/emulated/0/Android/data/com.sheeta.lmapp/files/models/';

  const adbPushCommand = `adb push ${selectedModel} /sdcard/Android/data/com.sheeta.lmapp/files/models/`;

  const recommendedModels = [
    {
      name: 'Qwen 2.5 1.5B Instruct',
      filename: 'qwen2.5-1.5b-instruct-q4_k_m.gguf',
      size: '1.1 GB',
      ramRequired: '2.5 GB RAM',
      speed: '45 - 65 tok/s',
      languageSupport: 'يدعم العربية والإنجليزية بطلاقة ممتازة',
      huggingfaceUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF'
    },
    {
      name: 'Llama 3.2 1B Instruct',
      filename: 'Llama-3.2-1B-Instruct-Q4_K_M.gguf',
      size: '800 MB',
      ramRequired: '1.8 GB RAM',
      speed: '55 - 75 tok/s',
      languageSupport: 'فائق السرعة وخفيف جداً على جميع الهواتف',
      huggingfaceUrl: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF'
    },
    {
      name: 'Llama 3.2 3B Instruct',
      filename: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
      size: '2.0 GB',
      ramRequired: '3.8 GB RAM',
      speed: '30 - 45 tok/s',
      languageSupport: 'قوة استدلال وفهم عالية جداً للأجهزة المتوسطة والعليا',
      huggingfaceUrl: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF'
    },
    {
      name: 'SmolLM2 1.7B Instruct',
      filename: 'smollm2-1.7b-instruct-q4_k_m.gguf',
      size: '1.05 GB',
      ramRequired: '2.2 GB RAM',
      speed: '50 - 65 tok/s',
      languageSupport: 'ممتاز في التلخيص وأداء المهام المحددة',
      huggingfaceUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF'
    }
  ];

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit mb-3 border border-emerald-500/20">
          <HardDrive className="w-3.5 h-3.5" />
          طريقة ChatterUI: قراءة مباشرة بدون نسخ أو استهلاك مساحة (Zero-Copy)
        </div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          كيف يعمل اختيار النماذج بأسلوب ChatterUI السلس في Sheeta LM؟
        </h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
          <b>لا حاجة لنسخ ملف النموذج أو مضاعفة حجمه!</b> تماماً مثل برنامج <span className="font-semibold text-indigo-400">ChatterUI</span>، إذا كان لديك نموذج GGUF محفوظ بالفعل على <b>كارت الميموري الخارجي (SD Card)</b> أو <b>مجلد المستندات/التنزيلات (Internal Storage)</b>، يفتح التطبيق نظام اختيار الملفات الرسمي في أندرويد (<span className="font-mono text-cyan-300">OpenDocument</span>) ويأخذ تصريح قراءة دائم (<span className="font-mono text-emerald-300">takePersistableUriPermission</span>). التطبيق يفتح مقبض الملف (<span className="font-mono text-indigo-300">FileDescriptor</span>) ويعمل معه مباشرة في مكانه دون نسخ بايت واحد.
        </p>
      </div>

      {/* المسار الفعلي الرئيسي */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4" />
            المسار الأساسي لمجلد النماذج داخل ذاكرة الهاتف (Models Directory)
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
            Direct mmap Access
          </span>
        </div>

        <div className="flex items-center justify-between bg-black/60 rounded-xl p-3 border border-slate-800 gap-3">
          <code className="text-xs font-mono text-emerald-300 break-all select-all">
            {modelsDirectoryPath}
          </code>
          <button
            onClick={() => handleCopy(modelsDirectoryPath, setCopiedPath)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition shrink-0"
          >
            {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPath ? 'تم النسخ' : 'نسخ المسار'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">في كود كوتلن (Kotlin Code):</span>
            <code className="font-mono text-cyan-300 text-[11px] block">
              context.getExternalFilesDir(&quot;models&quot;)?.absolutePath
            </code>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">لماذا هذا المسار تحديداً؟</span>
            <span className="text-slate-400 text-[11px]">
              لأنه مسار خاص بالتطبيق لا يحتاج صلاحيات معقدة من جوجل بلاي، ويقرأ ملفات الـ 4GB بسرعة قراءة NVMe الكاملة.
            </span>
          </div>
        </div>
      </div>

      {/* الطرق الثلاث لإضافة النموذج */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          الطرق العملية الثلاث لنقل النموذج إلى هاتفك
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* الطريقة 1: ADB Push */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> الطريقة 1 (الأسرع للمطورين)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">USB / Wi-Fi</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">أمر ADB المباشر من الكمبيوتر</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                اربط هاتفك بالكمبيوتر ونفّذ هذا الأمر لنقل نموذج بحجم 2GB في 15 ثانية فقط:
              </p>
            </div>

            <div className="bg-black/70 p-2.5 rounded-lg border border-slate-800/80">
              <code className="text-[10px] font-mono text-amber-300 block break-all">
                adb push model.gguf /sdcard/Android/data/com.sheeta.lmapp/files/models/
              </code>
            </div>
          </div>

          {/* الطريقة 2: File Picker من الهاتف */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> الطريقة 2 (بدون كمبيوتر)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">SAF Picker</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">التنزيل من متصفح الهاتف</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                نزّل أي نموذج <span className="font-mono text-indigo-300">.gguf</span> من HuggingFace مباشرة إلى مجلد التنزيلات (Downloads)، ثم اضغط في تطبيق Sheeta زر <span className="text-indigo-300 font-semibold">&quot;Import GGUF&quot;</span>.
              </p>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              يقوم مكوّن <code className="text-indigo-300 font-mono">ModelManager.kt</code> بنسخ النموذج تلقائياً وبدء تشغيله.
            </div>
          </div>

          {/* الطريقة 3: مدراء الملفات */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5" /> الطريقة 3 (مدير الملفات)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">File Manager</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">النسخ اليدوي في الهاتف</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                استخدم تطبيق مثل <b>Files by Google</b> أو <b>ZArchiver</b> لنسخ الملف يدوياً إلى:
                <br />
                <span className="font-mono text-[10px] text-cyan-300">Android/data/com.sheeta.lmapp/files/models/</span>
              </p>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              إذا لم يظهر مجلد <code className="text-cyan-300 font-mono">models</code>، أنشئه بنفسك أو سيقوم التطبيق بإنشائه عند أول تشغيل.
            </div>
          </div>

        </div>
      </div>

      {/* مولد أمر ADB التفاعلي */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            مولد أمر النقل السريع (ADB Push Command Generator)
          </span>
          <span className="text-[11px] text-slate-400">اختر النموذج لتوليد الأمر الجاهز للنسخ:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendedModels.map(m => (
            <button
              key={m.filename}
              onClick={() => setSelectedModel(m.filename)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono transition border ${
                selectedModel === m.filename
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between bg-black/80 rounded-xl p-3 border border-slate-800 gap-3">
          <code className="text-xs font-mono text-amber-300 break-all select-all">
            {adbPushCommand}
          </code>
          <button
            onClick={() => handleCopy(adbPushCommand, setCopiedAdb)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition shrink-0"
          >
            {copiedAdb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAdb ? 'تم النسخ' : 'نسخ الأمر'}</span>
          </button>
        </div>
      </div>

      {/* جدول النماذج الموصى بها للهواتف */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          أفضل نماذج GGUF الموصى بها لهواتف أندرويد (توازن الذاكرة والسرعة)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">النموذج</th>
                <th className="p-3">حجم الملف</th>
                <th className="p-3">الرام الأدنى</th>
                <th className="p-3">السرعة المتوقعة</th>
                <th className="p-3">الميزات</th>
                <th className="p-3 text-center">الرابط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recommendedModels.map(m => (
                <tr key={m.filename} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-slate-200">
                    <div>{m.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{m.filename}</div>
                  </td>
                  <td className="p-3 font-mono text-emerald-300">{m.size}</td>
                  <td className="p-3 font-mono text-amber-300">{m.ramRequired}</td>
                  <td className="p-3 font-mono text-cyan-300">{m.speed}</td>
                  <td className="p-3 text-slate-300">{m.languageSupport}</td>
                  <td className="p-3 text-center">
                    <a
                      href={m.huggingfaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      <span>GGUF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* تنبيه هندسي مهم */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200 leading-relaxed">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-1">ملاحظة هندسية حول مجلد الـ Assets في أندرويد ستوديو:</span>
          لا تضع ملفات النماذج الكبيرة (التي تتجاوز 1 جيجابايت) داخل مجلد <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">app/src/main/assets/</code> لأن حزمة الـ APK سيتجاوز حجمها الحد المسموح، وستواجه بطئاً شديداً في فك الضغط. الأسلوب القياسي في جميع تطبيقات الذكاء الاصطناعي على أندرويد (مثل MLC LLM و PocketPal) هو وضع ملفات الـ GGUF في <code className="font-mono bg-black/40 px-1 py-0.5 rounded text-amber-300">getExternalFilesDir(&quot;models&quot;)</code> لفتحها مباشرة عبر تقنية <code className="font-mono text-emerald-300">mmap()</code> بدون استهلاك ذاكرة RAM إضافية للنسخ.
        </div>
      </div>

    </div>
  );
}
