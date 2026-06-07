export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return Response.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(target)}`);
  const shortUrl = await res.text();

  if (!shortUrl.startsWith('https://')) {
    return Response.json({ error: 'Failed to shorten URL' }, { status: 500 });
  }

  return Response.json({ result_url: shortUrl });
}
