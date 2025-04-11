// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/app/lib/posts';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const posts = getAllPosts();

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.tags.join(' ').toLowerCase().includes(query)
  );

  const results = filtered.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt:
      post.content.length > 100
        ? post.content.slice(0, 100) + '...'
        : post.content,
  }));

  return NextResponse.json({ results });
}
