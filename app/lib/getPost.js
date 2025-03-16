import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content");  // 修正: "posts" から "content" に変更

// すべての slug を取得
export function getAllSlugs() {
  return fs.readdirSync(postsDirectory).map((file) => ({
    slug: file.replace(/\.md$/, ""),
  }));
}

// slug から記事を取得
export function getPost(slug) {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    date: data.date,
    thumbnail: data.thumbnail || null,
    tags: data.tags || [],
    contentHtml: content,
  };
}
