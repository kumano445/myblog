"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BlogPost({ post }: { post: any }) {
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?slug=${post.slug}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [post.slug]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, comment }),
      });

      if (res.ok) {
        setComment("");
        setComments((prev) => [...prev, comment]);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        {post.thumbnail && (
          <div className="mb-6">
            <Image src={post.thumbnail} alt={post.title} width={800} height={400} className="w-full h-64 object-cover rounded-lg" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-gray-500 text-sm">{post.date}</p>
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>

        <h2 className="mt-12 text-2xl font-bold">コメント</h2>
        {comments.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {comments.map((c, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-md">{c}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">まだコメントがありません。</p>
        )}

        <div className="mt-6">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="コメントを入力..." className="w-full p-2 border rounded-md" />
          <button onClick={handleCommentSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">コメントを投稿</button>
        </div>
      </div>
    </div>
  );
}
