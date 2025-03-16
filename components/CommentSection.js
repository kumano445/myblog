"use client";

import { useState } from "react";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const handleCommentSubmit = () => {
    if (comment.trim() === "") return; // 空コメント防止
    setComments([...comments, comment]);
    setComment(""); // 入力欄をリセット
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">コメント</h2>

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
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメントを入力..."
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleCommentSubmit}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          コメントを投稿
        </button>
      </div>
    </div>
  );
}
