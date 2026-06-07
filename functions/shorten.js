export async function onRequestPost({ request, env }) {
  const { url } = await request.json();

  if (!url) {
    return Response.json({ error: 'Missing url' }, { status: 400 });
  }

  const id = Math.random().toString(36).slice(2, 8);
  await env.URLS.put(id, url, { expirationTtl: 60 * 60 * 24 * 30 }); // 30 ngày

  const origin = new URL(request.url).origin;
  return Response.json({ result_url: `${origin}/s/${id}` });
}
