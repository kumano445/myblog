import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from "next/image";
import Layout from "@/components/Layout";
import CommentSection from "@/components/CommentSection";
import { notFound } from 'next/navigation';

async function fetchPostData(slug) {
    const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        thumbnail: data.thumbnail || null,
        contentHtml: content,
    };
}

export default async function Page({ params }) {
    if (!params || !params.slug) {
        return notFound();
    }

    const post = await fetchPostData(params.slug);
    if (!post) {
        return notFound();
    }

    return (
        <Layout>
            <div className="mt-10 space-y-16 border-gray-200 pt-10 sm:mt-16 sm:pt-16"></div>

            {post.thumbnail && (
                <div className="mb-6">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={800}
                        height={600}
                        className="w-full h-600 object-cover rounded-lg"
                    />
                </div>
            )}

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

            {post.date && <div className="flex items-center gap-x-4 text-xs mt-3 text-gray-500">{post.date}</div>}

            <h1 className="text-3xl font-bold mt-4">{post.title}</h1>

            <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

            <CommentSection />

            <div className="mt-10 space-y-16 border-gray-200 pt-10 sm:mt-16 sm:pt-16"></div>
        </Layout>
    );
}
