import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../components/Layout';

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const cleanContent = content.replace(/\n/g, ' ').trim();

    return {
      slug: fileName.replace('.md', ''),
      frontmatter: data,
      excerpt: cleanContent.length > 100 ? cleanContent.substring(0, 106) : cleanContent,
    };
  });

  return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

export default async function Blogs() {
  const posts = await getPosts();

  return (
    <Layout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h2>
            <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
              {posts.map((post) => (
                <article key={post.slug} className="flex max-w-xl flex-col items-start justify-between">
                  <div className="group relative">
                    {/* サムネイル画像 */}
                    {post.frontmatter.thumbnail && (
                      <img
                        src={post.frontmatter.thumbnail}
                        alt={post.frontmatter.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    {/* 日付を表示 */}
                    <div className="flex items-center gap-x-4 text-xs">
                      <div className="text-gray-500">{post.frontmatter.date}</div>
                    </div>
                    {/* 記事タイトル・リンク */}
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400">
                      <Link href={`/blog/${post.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    {/* 記事の初め100文字を表示 */}
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}