import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

type WriteupRequest = {
  title?: string;
  date?: string;
  tags?: string[] | string;
  content?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findUniqueSlug(baseSlug: string, dir: string): Promise<string> {
  let slug = baseSlug || `post-${Date.now()}`;
  let attempt = 1;

  while (true) {
    try {
      await fs.access(path.join(dir, `${slug}.mdx`));
      slug = `${baseSlug}-${attempt}`;
      attempt += 1;
    } catch {
      return slug;
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WriteupRequest;
    const title = (body.title ?? '').trim();
    const date = (body.date ?? '').trim();
    const content = (body.content ?? '').trim();
    const tagsInput = body.tags ?? [];
    const tags =
      Array.isArray(tagsInput) ? tagsInput.map((tag) => String(tag).trim()).filter(Boolean) : String(tagsInput)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

    if (!title || !date || !content) {
      return NextResponse.json(
        { error: 'Title, date, and content are required.' },
        { status: 400 }
      );
    }

    const blogDir = path.join(process.cwd(), 'content/blog');
    await fs.mkdir(blogDir, { recursive: true });

    const baseSlug = slugify(title);
    const slug = await findUniqueSlug(baseSlug, blogDir);
    const filePath = path.join(blogDir, `${slug}.mdx`);

    const mdx = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
---

${content}
`;

    await fs.writeFile(filePath, mdx, 'utf8');

    return NextResponse.json({ ok: true, slug });
  } catch {
    return NextResponse.json({ error: 'Failed to save writeup.' }, { status: 500 });
  }
}
