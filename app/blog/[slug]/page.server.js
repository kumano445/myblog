// app/blog/[slug]/page.server.js

import { getPostData } from "@/lib/posts"; // サーバーサイド専用のデータ取得

export function generateStaticParams() {
  const slugs = ['good-bye-world', 'another-article']; // 静的に生成するスラッグのリスト
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }) {
  const post = await getPostData(params.slug); // サーバーサイドでデータを取得

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
