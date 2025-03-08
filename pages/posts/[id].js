import { useState } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function getStaticProps({ params }) {
  const postPath = path.join(process.cwd(), "content", `${params.id}.md`);
  const fileContents = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(fileContents);

  const commentsPath = path.join(process.cwd(), "content", "comments.md");
  const comments = fs.existsSync(commentsPath) ? fs.readFileSync(commentsPath, "utf8") : "";

  return {
    props: {
      frontmatter: data,
      content,
      comments,
    },
  };
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), "content");
  const fileNames = fs.readdirSync(postsDirectory);
  const paths = fileNames.map((fileName) => ({
    params: { id: fileName.replace(".md", "") },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function Post({ frontmatter, content, comments }) {
  const [comment, setComment] = useState("");

  const submitComment = async (e) => {
    e.preventDefault();
    console.log("コメント送信ボタンが押されました"); 

    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });

    if (res.ok) {
      alert("コメントを投稿しました！");
      setComment(""); // フォームをクリア
    }else{
        console.log("コメント投稿に失敗しました")
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
      <p className="text-gray-600">{content}</p>

      {/* コメント入力フォーム */}
      <form onSubmit={submitComment} className="mt-6">
        <textarea
          className="border p-2 w-full rounded-md"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメントを入力..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          投稿
        </button>
      </form>

      {/* コメント一覧 */}
      <h2 className="mt-6 text-2xl font-bold">コメント</h2>
      <div className="mt-2 border p-4 bg-gray-100">
        <pre>{comments}</pre>
      </div>
    </div>
  );
}
