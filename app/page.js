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
      excerpt: cleanContent.length > 100 ? cleanContent.substring(0, 106) + '...' : cleanContent,
    };
  });

  return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

export default async function Blogs() {
  const posts = await getPosts();
  console.log("Number of posts:", posts.length); // デバッグ用

  return (
    <Layout>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-start">
            <form method="get" action="/search" target="_top" className="self-end">
              <input
                type="text"
                name="q"
                placeholder="Search articles..."
                className="border p-2 rounded-md"
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                Search
              </button>
            </form>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Photo</h2>

          <div className={`mt-10 grid gap-6 ${posts.length === 1 ? 'grid-cols-1' : posts.length === 2 ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                {post.frontmatter.thumbnail && (
                  <img src={post.frontmatter.thumbnail} alt={post.frontmatter.title} className="w-full h-60 object-cover" />
                )}

                <div className="p-5">
                  {post.frontmatter.tags && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400">
                    <Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
                  </h3>

                  <div className="mt-2 text-sm text-gray-500">{post.frontmatter.date}</div>

                  <p className="mt-2 text-sm text-gray-700">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
