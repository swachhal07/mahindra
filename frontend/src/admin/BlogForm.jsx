import React, { useMemo, useState } from 'react';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { api, assetUrl } from '../utils/adminApi';

const inputCls =
  'w-full bg-black/60 border border-neutral-700 focus:border-[#e21b22] rounded-lg text-white text-sm px-3.5 py-2.5 outline-none transition-colors';
const labelCls =
  'text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block';

// Format a Date for an <input type="date"> (YYYY-MM-DD).
const toDateInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

// Blog post add/edit form. `post` is null for "add new", or the serialized
// post from the API for editing.
export default function BlogForm({ post, onDone }) {
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [category, setCategory] = useState(post?.category ?? 'News');
  const [author, setAuthor] = useState(post?.author ?? 'Dugar Brothers and Sons Pvt LTD Team');
  const [date, setDate] = useState(toDateInput(post?.date) || toDateInput(new Date()));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  // Body is stored as an array of paragraphs; in the textarea, paragraphs
  // are separated by a blank line so writing is natural.
  const [bodyText, setBodyText] = useState(
    Array.isArray(post?.body) ? post.body.join('\n\n') : ''
  );
  const [imageFile, setImageFile] = useState(null);
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : assetUrl(post?.imageUrl)),
    [imageFile, post]
  );

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Title is required.');
    if (!isEdit && !imageFile) return setError('Please choose a featured image.');

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('slug', slug.trim());
    fd.append('category', category.trim());
    fd.append('author', author.trim());
    fd.append('date', date);
    fd.append('excerpt', excerpt.trim());
    fd.append('body', bodyText);
    if (imageFile) fd.append('image', imageFile);

    setBusy(true);
    try {
      await api(isEdit ? `/api/blog/${post.id}` : '/api/blog', {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
        auth: true,
      });
      onDone(true);
    } catch (err) {
      setError(err.message);
      setBusy(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 bg-black/60 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => onDone(false)}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black uppercase tracking-tight text-lg">
            {isEdit ? `Edit — ${post.title}` : 'Add Blog Post'}
          </h1>
        </div>
      </header>

      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="flex items-start gap-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Basics */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22]">Basics</h2>

          <div>
            <label className={labelCls}>Title *</label>
            <input
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FuelSmart Technology Explained"
              required
            />
          </div>

          <div>
            <label className={labelCls}>URL Slug</label>
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title if left blank"
            />
            <p className="text-neutral-600 text-[11px] mt-1.5">
              Lower-case letters, numbers, and dashes only. Used in the post URL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Category</label>
              <input
                className={inputCls}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input
                className={inputCls}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Excerpt</label>
            <textarea
              className={`${inputCls} min-h-[80px] resize-y`}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown on the blog list (1–2 sentences)."
            />
          </div>
        </section>

        {/* Body */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22]">
            Article Body
          </h2>
          <textarea
            className={`${inputCls} min-h-[400px] resize-y font-mono leading-relaxed`}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder={
              'Write the full article here.\n\nSeparate paragraphs with a blank line — each block of text becomes one paragraph on the page.\n\nLike this.'
            }
          />
          <p className="text-neutral-600 text-[11px]">
            Tip: leave a blank line between paragraphs. Each block becomes one paragraph on the
            public blog page.
          </p>
        </section>

        {/* Featured image */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="font-black uppercase tracking-wider text-sm text-[#e21b22] mb-5">
            Featured Image {isEdit ? '' : '*'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {imagePreview && (
              <div className="w-full sm:w-56 h-36 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-4 py-2.5 transition-colors">
                <Upload className="w-4 h-4" />
                {imageFile ? imageFile.name : isEdit ? 'Replace image' : 'Choose image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <p className="text-neutral-600 text-xs mt-3">
                Landscape photo, used as the article's hero image. Max 12 MB.
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pb-12">
          <button
            type="button"
            onClick={() => onDone(false)}
            disabled={busy}
            className="text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 hover:border-neutral-500 rounded-lg px-6 py-3.5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 sm:flex-none sm:px-10 inline-flex items-center justify-center gap-2 bg-[#e21b22] hover:bg-[#c4151b] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-colors"
          >
            {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
