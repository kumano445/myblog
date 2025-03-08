import { NextResponse } from "next/server";
import { getPost } from "@/app/lib/getPost";
import { NextRequest } from "next/server"; 

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params;

  console.log("Fetching post for slug:", slug);
  const post = await getPost(slug); 

  console.log("Fetched post:", post);

  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
