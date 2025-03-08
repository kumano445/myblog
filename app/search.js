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
  const query = ctx.query.q || "";
  const posts = getPosts(); // `lib/posts.ts` の関数を利用

  // FlexSearch インスタンスを作成
  const index = new FlexSearch.Document({
    tokenize: "full", // 日本語対応のために `full` を使用
    document: {
      id: "slug",
      index: ["title", "content"], // タイトルと本文の両方を検索対象
    },
  });

  // 記事データを追加
  posts.forEach((post) => {
    index.add({
      slug: post.slug,
      title: post.frontmatter.title,
      content: post.excerpt,
    });
  });

  // 検索実行
  const res = index.search(query, 10); // 最大10件取得
  const results = res.flat().map((r) => ({
    slug: r.slug,
    title: r.title,
  }));

  return {
    props: { query, results },
  };
}

export default SearchResult;