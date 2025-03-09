import { NextResponse } from "next/server";
import { getPost } from "@/lib/getPost";

export async function GET(request, { params }) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
  }

  const post = await getPost(slug);
  if (!post) {
    return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(post);
}
