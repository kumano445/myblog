import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { Document } from "flexsearch";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const postsDirectory = path.join(process.cwd(), "content");
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(".md", ""),
      frontmatter: data,
      excerpt: content.replace(/\n/g, " ").trim().slice(0, 100),
    };
  });

  const index = new Document({
    tokenize: "forward",
    document: {
      id: "slug",
      index: ["title", "content", "tags"],
    },
  } as any); // 型エラーを回避

  // 記事をインデックスに追加
  posts.forEach((post) => {
    index.add({
      slug: post.slug,
      title: post.frontmatter.title,
      content: post.excerpt,
      tags: post.frontmatter.tags ? post.frontmatter.tags.join(" ") : "",
    });
  });

  const searchResults = index.search(query, { enrich: true }) as { result: string[] }[];
  const searchSlugs = new Set(searchResults.flatMap((res) => res.result));

  const resultsMap = new Map<string, { slug: string; title?: string }>();
  searchSlugs.forEach((slug) => {
    const post = posts.find((p) => p.slug === slug);
    if (post) {
      resultsMap.set(slug, { slug: post.slug, title: post.frontmatter.title });
    }
  });

  return NextResponse.json({ results: Array.from(resultsMap.values()) }, { status: 200 });
}
