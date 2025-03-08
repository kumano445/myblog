import { NextRequest, NextResponse } from 'next/server';
import { getPost } from "@/app/lib/getPost";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log("Fetching post for slug:", params.slug);
  const post = getPost(params.slug);
  console.log("Fetched post:", post);

  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
