'use client';

import { useMemo, useRef, useState } from 'react';

function formatDateToday() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function WriteupEditor() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(formatDateToday());
  const [tags, setTags] = useState('writing, notes');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tagPreview = useMemo(
    () =>
      tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags]
  );

  function applyWrap(prefix: string, suffix = '') {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const nextValue = `${content.slice(0, start)}${prefix}${selected}${suffix}${content.slice(end)}`;
    setContent(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  }

  function applyLinePrefix(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const selected = content.slice(start, end);
    const after = content.slice(end);
    const normalized = selected || 'text';
    const nextSelected = normalized
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n');

    setContent(`${before}${nextSelected}${after}`);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + nextSelected.length);
    });
  }

  async function publishPost() {
    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch('/api/writeup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          content
        })
      });

      const result = (await response.json()) as { ok?: boolean; slug?: string; error?: string };
      if (!response.ok || !result.ok || !result.slug) {
        setStatus(result.error ?? 'Failed to publish.');
        return;
      }

      setStatus(`Published: /vaynotes/${result.slug}`);
    } catch {
      setStatus('Failed to publish.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="editor-shell">
      <div className="editor-grid">
        <label className="editor-label">
          Title
          <input className="editor-input" onChange={(event) => setTitle(event.target.value)} value={title} />
        </label>
        <label className="editor-label">
          Date
          <input className="editor-input" onChange={(event) => setDate(event.target.value)} type="date" value={date} />
        </label>
      </div>

      <label className="editor-label mt-4">
        Tags (comma-separated)
        <input className="editor-input" onChange={(event) => setTags(event.target.value)} value={tags} />
      </label>

      <div className="editor-toolbar mt-5">
        <button className="editor-btn" onClick={() => applyLinePrefix('# ')} type="button">H1</button>
        <button className="editor-btn" onClick={() => applyLinePrefix('## ')} type="button">H2</button>
        <button className="editor-btn" onClick={() => applyWrap('**', '**')} type="button">Bold</button>
        <button className="editor-btn" onClick={() => applyWrap('*', '*')} type="button">Italic</button>
        <button className="editor-btn" onClick={() => applyLinePrefix('- ')} type="button">List</button>
        <button className="editor-btn" onClick={() => applyLinePrefix('1. ')} type="button">Numbered</button>
        <button className="editor-btn" onClick={() => applyLinePrefix('> ')} type="button">Quote</button>
        <button className="editor-btn" onClick={() => applyWrap('`', '`')} type="button">Code</button>
        <button className="editor-btn" onClick={() => applyWrap('[', '](https://)')} type="button">Link</button>
      </div>

      <label className="editor-label mt-4">
        Content
        <textarea
          className="editor-area"
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your blog in Markdown or MDX..."
          ref={textareaRef}
          value={content}
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="editor-publish" disabled={isSaving} onClick={publishPost} type="button">
          {isSaving ? 'publishing...' : 'publish blog'}
        </button>
        {status ? <p className="text-sm text-neutral-300">{status}</p> : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tagPreview.map((tag) => (
          <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-neutral-300" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
