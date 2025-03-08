import { NextResponse } from "next/server";
import { getPost } from "@/app/lib/getPost";

export async function GET(req: Request, context: { params: { slug: string } }) {
  const { params } = await context; 

  console.log("Fetching post for slug:", params.slug);
  const post = getPost(params.slug);
  console.log("Fetched post:", post);

  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
