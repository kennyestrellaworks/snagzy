import { useState, useRef } from 'react';
import { Search, Clipboard, Loader2, RotateCcw } from 'lucide-react';

export default function CoordinateInput({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSubmit(text);
  };

  const handleClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Paste Coordinates</label>
        <button
          type="button"
          onClick={handlePaste}
          className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <Clipboard className="w-3.5 h-3.5" />
          Paste from clipboard
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`latitude: "-33.8800",\nlongitude: "151.2067",`}
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 resize-none font-mono transition-all"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Look up place
            </>
          )}
        </button>

        {text && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
