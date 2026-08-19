import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Smile,
  Send,
  Loader2,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Food",
  "Business",
  "Art",
  "Science",
  "Other",
];

export default function CreatePost({ onCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [emojiError, setEmojiError] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    const fetchEmojis = async () => {
      const { data, error: fetchError } = await supabase
        .from("emojis")
        .select("id, value")
        .order("position", { ascending: true });

      if (fetchError) {
        setEmojiError(fetchError.message);
        return;
      }

      setEmojis(data || []);
    };

    fetchEmojis();
  }, []);

  const refreshContent = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const exec = useCallback(
    (command, value = null) => {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      refreshContent();
    },
    [refreshContent],
  );

  const handleBold = () => exec("bold");
  const handleItalic = () => exec("italic");
  const handleUnderline = () => exec("underline");

  const saveSelection = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (!savedRangeRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const handleLink = () => {
    if (showLinkInput) {
      const url = linkUrl.trim();
      if (url) {
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        restoreSelection();
        exec("createLink", fullUrl);
        if (editorRef.current) {
          editorRef.current.querySelectorAll("a").forEach((a) => {
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
          });
          refreshContent();
        }
      }
      setShowLinkInput(false);
      setLinkUrl("");
      savedRangeRef.current = null;
    } else {
      saveSelection();
      setShowLinkInput(true);
    }
  };

  const insertEmoji = (emoji) => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, emoji);
    refreshContent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content,
        category,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setContent("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setShowEmojiPicker(false);
    setShowLinkInput(false);
    setLinkUrl("");

    if (onCreated) onCreated(data);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Create a New Post
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Share your thoughts with rich text formatting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Content editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Content
          </label>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-3 py-2 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
            <ToolbarButton onClick={handleBold} label="Bold">
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleItalic} label="Italic">
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={handleUnderline} label="Underline">
              <Underline className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={handleLink}
              label="Insert link"
              active={showLinkInput}
              onMouseDown={(e) => e.preventDefault()}
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setShowEmojiPicker((v) => !v)}
              label="Emojis"
              active={showEmojiPicker}
            >
              <Smile className="w-4 h-4" />
            </ToolbarButton>

            {showLinkInput && (
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLink();
                    }
                  }}
                  placeholder="https://example.com"
                  className="px-2.5 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                />
                <button
                  type="button"
                  onClick={handleLink}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl("");
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute z-10 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg grid grid-cols-8 gap-1 max-w-xs">
              {emojiError ? (
                <p className="col-span-8 text-xs text-red-600">
                  Unable to load emojis.
                </p>
              ) : emojis.length === 0 ? (
                <p className="col-span-8 text-xs text-gray-500">
                  Loading emojis...
                </p>
              ) : (
                emojis.map(({ id, value }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      insertEmoji(value);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition"
                  >
                    {value}
                  </button>
                ))
              )}
            </div>
          )}

          {/* Editable area */}
          <div
            ref={editorRef}
            onInput={refreshContent}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write your post content here..."
            className="min-h-[160px] max-h-[400px] overflow-y-auto px-4 py-3 border border-gray-300 rounded-b-lg text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent prose-content"
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            Post created successfully!
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {saving ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ToolbarButton({ children, onClick, label, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-2 rounded-md transition ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
