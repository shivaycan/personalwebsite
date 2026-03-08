import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export type BlogFrontmatter = {
  title: string;
  date: string;
  tags: string[];
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
};

type PostFile = {
  fileName: string;
  slug: string;
};

function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\.mdx$/, '')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPostFiles(): PostFile[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((fileName) => ({
      fileName,
      slug: createSlug(fileName)
    }));
}

export function getAllSlugs(): string[] {
  return getPostFiles().map((post) => post.slug);
}

export function getPostBySlug(slug: string): {
  frontmatter: BlogFrontmatter;
  content: string;
} {
  const match = getPostFiles().find((post) => post.slug === createSlug(slug));
  if (!match) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const filePath = path.join(blogDirectory, match.fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    frontmatter: {
      title: String(data.title),
      date: String(data.date),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : []
    },
    content
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return getPostFiles()
    .map((post) => {
      const { frontmatter } = getPostBySlug(post.slug);
      return {
        slug: post.slug,
        ...frontmatter
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
