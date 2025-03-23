// app/api/search/route.js

import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

// GET メソッドの API ハンドラー
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const q = searchParams.get('q');

    console.log('API にリクエストが来ました', q);

    const posts = await getAllPosts();  // 非同期のデータ取得

    if (!posts || posts.length === 0) {
      console.log('記事が取得できませんでした');
    }

    // 検索結果をフィルタリング
    const filteredPosts = searchPosts(posts, q);
    console.log('検索結果:', filteredPosts);

    return NextResponse.json({ results: filteredPosts }, { status: 200 });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 検索関数
function searchPosts(posts, query) {
  if (!query) return posts; // クエリが空の場合は全記事を返す
  const lowerQuery = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery)
  );
}
