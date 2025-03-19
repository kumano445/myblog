"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import Link from "next/link";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results))
        .catch((err) => console.error("Error fetching search results:", err));
    }
  }, [query]);

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

export default SearchPage;
