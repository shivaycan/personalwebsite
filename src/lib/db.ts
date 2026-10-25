import 'server-only';
import postgres from 'postgres';

export type NoteInput = {
  id?: string;
  title: string;
  body: string;
  theme: string;
  date?: string;
  tags?: string[];
};

export type Note = {
  id: string;
  title: string;
  body: string;
  theme: string;
  date: string;
  tags: string[];
  updatedAt: string;
};

const themes = new Set(['dark', 'forest', 'paper', 'oxblood', 'blue', 'lavender', 'graph']);
type DbGlobal = typeof globalThis & {
  vaynotesSql?: ReturnType<typeof postgres>;
  vaynotesSchemaReady?: Promise<void>;
};

function connection() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Database not configured. Add DATABASE_URL to the server environment.');
  const root = globalThis as DbGlobal;
  root.vaynotesSql ??= postgres(url, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10
  });
  return root.vaynotesSql;
}

async function ensureSchema() {
  const root = globalThis as DbGlobal;
  if (!root.vaynotesSchemaReady) {
    root.vaynotesSchemaReady = connection()`
      CREATE TABLE IF NOT EXISTS vaynotes_notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        theme TEXT NOT NULL DEFAULT 'dark',
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined).catch((error) => {
      root.vaynotesSchemaReady = undefined;
      throw error;
    });
  }
  await root.vaynotesSchemaReady;
}

function toNote(row: Record<string, unknown>): Note {
  const dateValue = row.date;
  const date = dateValue instanceof Date
    ? dateValue.toISOString().slice(0, 10)
    : String(dateValue).slice(0, 10);
  const rawTags = row.tags;
  let tags: string[] = [];
  if (Array.isArray(rawTags)) tags = rawTags.map(String);
  else if (typeof rawTags === 'string') {
    try { tags = JSON.parse(rawTags); } catch { tags = []; }
  }
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    theme: String(row.theme),
    date,
    tags,
    updatedAt: new Date(String(row.updated_at)).toISOString()
  };
}

function validate(input: NoteInput) {
  const title = String(input.title ?? '').trim().slice(0, 160);
  const body = String(input.body ?? '').slice(0, 100_000);
  const theme = themes.has(input.theme) ? input.theme : 'dark';
  const tags = Array.isArray(input.tags)
    ? input.tags.map((tag) => String(tag).trim().slice(0, 40)).filter(Boolean).slice(0, 12)
    : [];
  const date = typeof input.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.date)
    ? input.date
    : new Date().toISOString().slice(0, 10);
  if (!title || !body.trim()) throw new Error('A title and note body are required.');
  return { title, body, theme, tags, date };
}

export async function listNotes(): Promise<Note[]> {
  await ensureSchema();
  const rows = await connection()`
    SELECT id, title, body, theme, date, tags, updated_at
    FROM vaynotes_notes
    ORDER BY date DESC, created_at DESC
  `;
  return rows.map((row) => toNote(row as Record<string, unknown>));
}

export async function createNote(input: NoteInput): Promise<Note> {
  await ensureSchema();
  const value = validate(input);
  const id = input.id?.trim().slice(0, 100) || crypto.randomUUID();
  const [row] = await connection()`
    INSERT INTO vaynotes_notes (id, title, body, theme, date, tags)
    VALUES (${id}, ${value.title}, ${value.body}, ${value.theme}, ${value.date}, ${JSON.stringify(value.tags)}::jsonb)
    RETURNING id, title, body, theme, date, tags, updated_at
  `;
  return toNote(row as Record<string, unknown>);
}

export async function updateNote(id: string, input: NoteInput): Promise<Note | null> {
  await ensureSchema();
  const value = validate(input);
  const [row] = await connection()`
    UPDATE vaynotes_notes
    SET title = ${value.title}, body = ${value.body}, theme = ${value.theme},
        date = ${value.date}, tags = ${JSON.stringify(value.tags)}::jsonb, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, body, theme, date, tags, updated_at
  `;
  return row ? toNote(row as Record<string, unknown>) : null;
}

export async function deleteNote(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = await connection()`
    DELETE FROM vaynotes_notes WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function importNotes(inputs: NoteInput[]) {
  await ensureSchema();
  let imported = 0;
  for (const input of inputs) {
    const value = validate(input);
    const id = input.id?.trim().slice(0, 100) || crypto.randomUUID();
    const rows = await connection()`
      INSERT INTO vaynotes_notes (id, title, body, theme, date, tags)
      VALUES (${id}, ${value.title}, ${value.body}, ${value.theme}, ${value.date}, ${JSON.stringify(value.tags)}::jsonb)
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    imported += rows.length;
  }
  return imported;
}
