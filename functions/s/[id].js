export async function onRequestGet({ params, env }) {
  const url = await env.URLS.get(params.id);

  if (!url) {
    return new Response('Link not found or expired', { status: 404 });
  }

  return Response.redirect(url, 302);
}
