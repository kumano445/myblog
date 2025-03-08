<<<<<<< HEAD
import './content.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import Image from 'next/image';
import Layout from '../../../components/Layout';

// ブログ記事ページ
export default async function BlogPost({ params }) {
=======
"use client";

import "./content.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "../../../components/Layout";

export default function BlogPost({ params }) {
>>>>>>> 038ef23 (third)
  const { slug } = params;

<<<<<<< HEAD
  // ファイルが存在しない場合はエラーを回避
  if (!fs.existsSync(filePath)) {
    return <p className="text-center text-gray-500">記事が見つかりません</p>;
  }

  // ファイルの中身を取得
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const title = data.title; // 記事のタイトル
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);
  const contentHtml = processedContent.toString(); // 記事の本文をHTMLに変換

  return (
    <Layout> 
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        {/* サムネイル画像を表示 */}
        {data.thumbnail && (
          <div className="mb-6">
            <Image
              src={data.thumbnail}
              alt={title}
              width={800}  // 幅
              height={400} // 高さ
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* 記事タイトル */}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        {/* 投稿日を追加 */}
        <p className="text-gray-500 text-sm mt-2">{data.date}</p>
        {/* 記事本文 */}
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        
      </div>
    </div>
    </Layout> 
=======
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setPost(data);
        }
      } catch (error) {
        console.error("記事の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?slug=${slug}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [slug]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, comment }),
      });

      if (res.ok) {
        setComment("");
        setComments((prev) => [...prev, comment]);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">記事を読み込み中...</p>;
  if (!post) return <p className="text-center text-gray-500">記事が見つかりません</p>;

  return (
    <Layout>
      <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          {/* サムネイル画像を表示 */}
          {post.thumbnail && (
            <div className="mb-6">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* タグ*/}
          {post.tags && post.tags.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">タグなし</p>
          )}

          {/* 記事タイトル */}
          <h1 className="text-3xl font-bold">{post.title}</h1>

          {/* 投稿日を追加 */}
          <p className="text-gray-500 text-sm">{post.date}</p>

          {/* 記事本文 */}
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>

          {/* コメント */}
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
      </div>
    </Layout>
>>>>>>> 038ef23 (third)
  );
}
