import Layout from "../components/Layout";
import Link from "next/link";
import { getPosts } from "../lib/posts";
import FlexSearch from "flexsearch";

const SearchResult = ({ query, results }) => {
return (
<Layout>
    <h1>Search Results</h1>
        <h2>Query: {query}</h2>
        <ul>
            {results.length > 0 ? (
            results.map((res, idx) => (
            <li key={idx}>
                <Link href={`/blog/${res.slug}`}>{res.title}</Link>
            </li>
            ))
        ) : (
            <p>No results found</p>
        )}
        </ul>
    </Layout>
    );
};

export async function getServerSideProps(ctx) {
  const query = (ctx.query.q || "").toLowerCase(); 
  const posts = getPosts(); 

  // FlexSearch インスタンスを作成
  const index = new FlexSearch.Document({
    tokenize: "full", 
    document: {
      id: "slug",
      index: ["title", "content", "tags"],
    },
  });

  // 記事データを追加
  posts.forEach((post) => {
    index.add({
      slug: post.slug,
      title: post.frontmatter.title,
      content: post.excerpt,
      tags: post.frontmatter.tags ? post.frontmatter.tags.join(" ") : "",
    });
  });

  // 検索実行
  const res = index.search(query, { enrich: true });

  const results = res.flatMap(({ result }) =>
    result.map((r) => ({
      slug: r.doc.slug,
      title: r.doc.title,
    }))
  );

  return {
    props: { query, results },
  };
}

export default SearchResult;