export default async function BlogPostPage({ params }) {
  if (!params || !params.slug) {
    return <p>記事が見つかりませんでした。</p>;
  }

  const post = await getPostData(params.slug);

  if (!post) {
    return <p>記事が見つかりませんでした。</p>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
