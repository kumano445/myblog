import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import FlexSearch from "flexsearch";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const postsDirectory = path.join(process.cwd(), "content");
  const fileNames = fs.readdirSync(postsDirectory);

  // 記事データを取得
  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(".md", ""),
      title: data.title || "無題",
      tags: Array.isArray(data.tags) ? data.tags.join(" ") : "", // 配列を文字列に変換
      description: data.description || "",
      content: content.replace(/\n/g, " ").trim(),
    };
  });

  // **FlexSearch のインデックス作成**
  const index = new FlexSearch.Document({
    document: {
      id: "slug",  // IDとしてslugを使用
      index: ["title", "content", "tags"],  // 検索対象フィールドを指定
    },
  });

  // **記事データをインデックスに追加**
  posts.forEach((post) => {
    index.add({
      id: post.slug, // `id` を `slug` に対応させる
      title: post.title,
      tags: post.tags,
      description: post.description,
      content: post.content,
    });
  });

  // **検索処理**
  const searchResults = index.search(query, { enrich: true }) as {
    field: string;
    result: { id: string }[]; 
  }[];

  if (!searchResults || searchResults.length === 0) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  // **検索結果の取得**
  const results: { slug: string; title: string; description: string }[] = [];

  searchResults.forEach((res) => {
    res.result.forEach((doc) => {
      const post = posts.find((p) => p.slug.toLowerCase() === doc.id.toLowerCase());
      if (post) {
        results.push({
          slug: post.slug,
          title: post.title,
          description: post.description,
        });
      }
    });
  });

  return NextResponse.json({ results }, { status: 200 });
}
