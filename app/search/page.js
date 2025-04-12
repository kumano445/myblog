import Layout from "@/components/Layout";
import Antigravity from "@/components/Antigravity";
import Link from "next/link";
import Image from "next/image";
import FlexSearch from "flexsearch";
import { getAllPosts } from "@/app/lib/posts";

export default async function Page(props) {
  const searchParams = props.searchParams;
  const query = searchParams?.q || "";

  const posts = getAllPosts();

  const index = new FlexSearch.Document({
    tokenize: "full",
    charset: "full",
    document: {
      id: "slug",
      index: ["title", "content", "tags"],
    },
  });

  const postMap = new Map();
  posts.forEach((post) => {
    postMap.set(post.slug, post);
    index.add({
      slug: post.slug,
      title: post.title,
      content: post.description + " " + post.content,
      tags: post.tags.join(" "),
      doc: post,
    });
  });

  const results = query ? index.search(query, { enrich: true }) : [];
  const flatResults = results.flatMap((r) =>
    r.result.map((id) => postMap.get(id))
  );

  return (
    <Layout>
      <Antigravity />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">
          「{query}」の検索結果
        </h2>

        {flatResults.length === 0 ? (
          <p className="text-gray-500">該当する記事は見つかりませんでした。</p>
        ) : (
          <ul className="space-y-8">
            {flatResults.map((post) => (
              <li
                key={post.slug}
                className="bg-white/80 rounded-lg shadow p-6 flex gap-4 items-center backdrop-blur"
              >
                {/* サムネイル表示 */}
                {post.thumbnail && (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                  />
                )}

                {/* 記事情報 */}
                <div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-semibold hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{post.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{post.date}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
