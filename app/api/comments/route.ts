import { NextResponse } from "next/server";

const comments = new Map<string, string[]>(); 

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug || !comments.has(slug)) {
    return NextResponse.json({ comments: [] }, { status: 200 });
  }

  return NextResponse.json({ comments: comments.get(slug) });
}

export async function POST(req: Request) {
  const { slug, comment } = await req.json();

  if (!slug || !comment) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (!comments.has(slug)) {
    comments.set(slug, []);
  }

  comments.get(slug)?.push(comment);

  return NextResponse.json({ message: "Comment added" }, { status: 201 });
}
