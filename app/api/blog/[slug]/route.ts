import { NextResponse } from "next/server";
import { getPost } from "@/app/lib/getPost";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("Fetching post for slug:", slug);
  const post = await getPost(slug); // 非同期のgetPost関数をawait

  console.log("Fetched post:", post);

  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
