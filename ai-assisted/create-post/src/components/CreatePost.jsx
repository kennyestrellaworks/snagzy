import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "Technology",
  "Lifestyle",
  "Business",
  "Travel",
  "Food",
  "Other",
];

export default function CreatePost({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const editorRef = useRef(null);

  function execCommand(command, value = null) {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  }

  function applyLinkTargets() {
    if (!editorRef.current) return;

    const links = editorRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    setContent(editorRef.current.innerHTML);
  }

  function handleLink() {
    const url = window.prompt("Enter the URL:");
    if (url) {
      execCommand("createLink", url);
      applyLinkTargets();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("posts").insert({
      title: title.trim(),
      content,
      category,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setTitle("");
    setContent("");
    setCategory(CATEGORIES[0]);
    if (editorRef.current) editorRef.current.innerHTML = "";
    if (onCreated) onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-slate-900">Create a Post</h2>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Post created successfully.
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Content
          </span>
          <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10">
            <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
              <ToolbarButton onClick={() => execCommand("bold")} label="Bold">
                <span className="font-bold">B</span>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => execCommand("italic")}
                label="Italic"
              >
                <span className="italic">I</span>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => execCommand("underline")}
                label="Underline"
              >
                <span className="underline">U</span>
              </ToolbarButton>
              <ToolbarButton onClick={handleLink} label="Insert link">
                Link
              </ToolbarButton>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              className="min-h-[180px] px-3.5 py-3 text-slate-900 outline-none prose-sm"
              data-placeholder="Write your post content..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
}

function ToolbarButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="min-w-[2rem] rounded px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-200"
    >
      {children}
    </button>
  );
}
