'use client';

import { FormEvent, useEffect, useState } from 'react';

type Note = { id: string; title: string; body: string; theme: string; date: string; tags: string[] };
const themes = ['dark', 'forest', 'paper', 'oxblood', 'blue', 'lavender', 'graph'];
const inputStyle = { width: '100%', padding: '13px 14px', border: '1px solid #333', background: '#090909', color: '#eee', borderRadius: 8, font: 'inherit' };
const buttonStyle = { padding: '10px 15px', border: '1px solid #444', borderRadius: 999, background: '#eeeade', color: '#111', cursor: 'pointer', font: 'inherit' };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editing, setEditing] = useState<Note | null>(null);

  async function refresh() {
    const response = await fetch('/api/notes', { cache: 'no-store' });
    if (!response.ok) throw new Error('Database is not connected. Add DATABASE_URL in Vercel.');
    setNotes(await response.json());
  }
  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json()).then(async data => {
      if (data.authenticated) { setAuthenticated(true); try { await refresh(); } catch (e) { setError((e as Error).message); } }
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault(); setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Could not log in.'); return; }
    setPassword(''); setAuthenticated(true);
    try { await refresh(); } catch (err) { setError((err as Error).message); }
  }
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }); setAuthenticated(false); setNotes([]); setEditing(null);
  }
  async function save(e: FormEvent) {
    e.preventDefault(); if (!editing) return; setError('');
    const response = await fetch(`/api/notes/${encodeURIComponent(editing.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Could not save note.'); return; }
    setEditing(null); await refresh();
  }
  async function remove(note: Note) {
    if (!window.confirm(`Delete “${note.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/notes/${encodeURIComponent(note.id)}`, { method: 'DELETE' });
    if (!response.ok) { const data = await response.json(); setError(data.error || 'Could not delete note.'); return; }
    setNotes(current => current.filter(item => item.id !== note.id));
  }
  async function importBrowserNotes() {
    try {
      const local = JSON.parse(localStorage.getItem('vaynotes-posts') || '[]');
      if (!Array.isArray(local) || !local.length) { setError('No browser notes found to import.'); return; }
      const response = await fetch('/api/notes/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes: local }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Import failed.');
      await refresh(); setError(`Imported ${data.imported} notes from this browser.`);
    } catch (e) { setError((e as Error).message); }
  }

  return <main style={{ minHeight: '100vh', background: '#000', color: '#eeeade', padding: '30px max(20px, calc((100vw - 900px)/2))', fontFamily: 'Arial, sans-serif' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #282828', paddingBottom: 18 }}><a href="/" style={{ color: 'inherit', textDecoration: 'none', fontSize: 21, fontWeight: 700 }}>vaynotes·</a>{authenticated && <button onClick={logout} style={{ ...buttonStyle, background: 'transparent', color: '#aaa' }}>Log out</button>}</header>
    {!ready ? <p style={{ color: '#888' }}>Loading…</p> : !authenticated ? <form onSubmit={login} style={{ maxWidth: 420, margin: '12vh auto', display: 'grid', gap: 14 }}><p style={{ color: '#999', letterSpacing: '.12em', fontSize: 12 }}>PRIVATE SPACE</p><h1 style={{ fontWeight: 400, fontSize: 40, margin: '0 0 12px' }}>Admin</h1><input autoComplete="username" placeholder="User ID" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} required /><input autoComplete="current-password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required /><button style={buttonStyle}>Log in</button>{error && <p role="status" style={{ color: '#d9948c' }}>{error}</p>}</form> : <section style={{ paddingTop: 36 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap' }}><div><p style={{ color: '#888', letterSpacing: '.12em', fontSize: 12 }}>YOUR NOTES</p><h1 style={{ fontWeight: 400, fontSize: 36, margin: '8px 0 20px' }}>Manage the archive</h1></div><button onClick={importBrowserNotes} style={{ ...buttonStyle, background: 'transparent', color: '#eeeade' }}>Import this browser’s notes</button></div>
      {error && <p role="status" style={{ color: '#d9c992' }}>{error}</p>}
      {editing && <form onSubmit={save} style={{ display: 'grid', gap: 12, padding: 18, background: '#0a0a0a', marginBottom: 24, borderRadius: 10 }}><h2 style={{ margin: '0 0 4px', fontWeight: 400 }}>Edit note</h2><input aria-label="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={inputStyle} required /><textarea aria-label="Body" value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} rows={8} style={{ ...inputStyle, resize: 'vertical' }} required /><div style={{ display: 'flex', gap: 10 }}><select aria-label="Theme" value={editing.theme} onChange={e => setEditing({ ...editing, theme: e.target.value })} style={inputStyle}>{themes.map(t => <option key={t}>{t}</option>)}</select><input aria-label="Tags, comma separated" value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} style={inputStyle} /></div><div style={{ display: 'flex', gap: 10 }}><button style={buttonStyle}>Save changes</button><button type="button" onClick={() => setEditing(null)} style={{ ...buttonStyle, background: 'transparent', color: '#eee' }}>Cancel</button></div></form>}
      <div style={{ display: 'grid', gap: 1 }}>{notes.map(note => <article key={note.id} style={{ padding: '18px 0', borderTop: '1px solid #242424', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}><div style={{ minWidth: 0 }}><h2 style={{ fontWeight: 400, fontSize: 22, margin: '0 0 7px', overflowWrap: 'anywhere' }}>{note.title}</h2><p style={{ margin: 0, color: '#888', fontSize: 13 }}>{note.date} · {note.theme} · {note.body.replace(/<[^>]*>/g, ' ').slice(0, 120)}</p></div><div style={{ display: 'flex', gap: 8, flexShrink: 0 }}><button onClick={() => setEditing({ ...note })} style={{ ...buttonStyle, padding: '8px 12px' }}>Edit</button><button onClick={() => remove(note)} style={{ ...buttonStyle, padding: '8px 12px', background: 'transparent', color: '#e29c95' }}>Delete</button></div></article>)}</div>
    </section>}
  </main>;
}
