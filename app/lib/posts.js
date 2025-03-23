// app/lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export function getAllPosts() {
  const contentDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(contentDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title || "タイトルなし",
      content: content || "",
      date: data.date || "日付不明",
      tags: data.tags || [],
    };
  });
}


export async function getPostData(slug) {
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null; // 記事が存在しない場合
  }

  // ファイル読み込み
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // Markdown を HTML に変換
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || "タイトルなし",
    date: data.date || "日付不明",
    thumbnail: data.thumbnail || null,
    tags: data.tags || [], // タグを取得
    contentHtml,
  };
}


// getAllSlugs 関数も定義
export async function getAllSlugs() {
  const contentDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(contentDirectory);

  const slugs = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    return { slug };
  });

  return slugs;
}
