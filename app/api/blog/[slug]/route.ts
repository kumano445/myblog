import { NextResponse } from "next/server";
import { getPost } from "@/app/lib/getPost";

export async function GET(req: Request) {
  const { slug } = req.params; // reqからslugを取得

  console.log("Fetching post for slug:", slug);
  const post = await getPost(slug); 

  console.log("Fetched post:", post);

  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
