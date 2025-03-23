import { getPostData } from "@/lib/posts";

export async function GET(request, { params }) {
    if (!params || !params.slug) {
        return new Response(JSON.stringify({ error: "記事が見つかりませんでした。" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }

    const post = await getPostData(params.slug);

    if (!post) {
        return new Response(JSON.stringify({ error: "記事が見つかりませんでした。" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify(post), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
