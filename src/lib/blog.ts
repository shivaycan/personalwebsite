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

export function getAllSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): {
  frontmatter: BlogFrontmatter;
  content: string;
} {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
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
  return getAllSlugs()
    .map((slug) => {
      const { frontmatter } = getPostBySlug(slug);
      return {
        slug,
        ...frontmatter
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
