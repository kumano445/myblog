import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);

  return {
    title: data.title,
    date: data.date,
    thumbnail: data.thumbnail || null,
    tags: data.tags || [],
    contentHtml: processedContent.toString(),
  };
}
