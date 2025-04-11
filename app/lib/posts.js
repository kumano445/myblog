// app/lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import striptags from "striptags";

export function getAllPosts() {
  const contentDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(contentDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const processed = unified()
      .use(remarkParse)
      .use(remarkHtml)
      .processSync(content);

    const htmlContent = processed.toString();
    const plainText = striptags(htmlContent);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title || "タイトルなし",
      content: plainText || "",
      contentHtml: htmlContent, // ★ 追加
      description: data.description || "",
      date: data.date || "日付不明",
      tags: data.tags || [],
    };
  });
}
