
import { getPost } from "@/lib/getPost";
import BlogPost from "./BlogPost";


export default async function Page({ params }: { params: { slug?: string } }) {
  const { slug } = await Promise.resolve(params); 

  if (!params?.slug) {
    return <p className="text-center text-gray-500">記事が見つかりません</p>;
  }

  const post = await getPost(params.slug);

  if (!post) {
    return <p className="text-center text-gray-500">記事が見つかりません</p>;
  }

  return <BlogPost post={{ ...post, slug: params.slug }} />;
}
