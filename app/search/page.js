import FlexSearch from "flexsearch";
import { getAllPosts } from "../lib/posts"; 

export default async function Page(props) {
  const searchParams = await props.searchParams; 
  const query = (searchParams?.q || "");

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
  const flatResults = results.flatMap((r) => r.result.map((id) => postMap.get(id)));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search results for: {query}</h1>
      <ul className="space-y-4">
      {flatResults.length > 0 ? (
          flatResults.map((post) => {
            if (!post) return null;
            return (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:underline text-xl font-bold"
                >
                  {post.title}
                </a>
                {/* <div }
                  className="prose max-w-none mt-2"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                >/*/}
              </li>
            );
          })
        ) : (
          <li>検索結果が見つかりませんでした。</li>
        )}
      </ul>
    </div>
  );
}
