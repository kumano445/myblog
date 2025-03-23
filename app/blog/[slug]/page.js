import Image from "next/image";
import Layout from "@/components/Layout";
import CommentSection from "@/components/CommentSection";

async function fetchPostData(slug) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/${slug}`);

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export default async function Page({ params }) {
    const { slug } = params; // ✅ await を削除して修正

    const post = await fetchPostData(slug); // ✅ fetch を絶対 URL に修正
    console.log(post); // デバッグ用

    if (!post) {
        return <p>記事が見つかりませんでした。</p>;
    }

    return (
        <Layout>
            <div className="mt-10 space-y-16 border-gray-200 pt-10 sm:mt-16 sm:pt-16"></div>

            {/* サムネイル画像 */}
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

            {/* タグを表示 */}
            {post.tags?.length > 0 ? (
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

            {/* 日付 */}
            {post.date && <div className="flex items-center gap-x-4 text-xs mt-3 text-gray-500">{post.date}</div>}

            {/* 記事タイトル */}
            <h1 className="text-3xl font-bold mt-4">{post.title}</h1>

            {/* 記事本文 */}
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

            {/* コメントセクション */}
            <CommentSection />

            <div className="mt-10 space-y-16 border-gray-200 pt-10 sm:mt-16 sm:pt-16"></div>
        </Layout>
    );
}
