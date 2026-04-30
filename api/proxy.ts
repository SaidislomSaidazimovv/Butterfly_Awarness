// Reverse proxy: serve butterflychallenge.net content under
// thebutterflychallenge.com without changing the address bar.
// All requests to / are rewritten to /api/proxy?vercelPath=... by
// vercel.json. This function fetches the upstream and streams it back.

export const config = { runtime: 'edge' };

const UPSTREAM = 'https://butterflychallenge.net';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const params = url.searchParams;
  const path = params.get('vercelPath') ?? '';
  params.delete('vercelPath');
  const qs = params.toString();
  const target = `${UPSTREAM}/${path}${qs ? `?${qs}` : ''}`;

  // Forward the request mostly intact, but strip headers Vercel will
  // set itself or that would mislead the upstream.
  const fwdHeaders = new Headers(req.headers);
  fwdHeaders.delete('host');
  fwdHeaders.delete('x-forwarded-host');
  fwdHeaders.delete('x-vercel-id');
  fwdHeaders.delete('x-vercel-deployment-url');

  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method: req.method,
    headers: fwdHeaders,
    body,
    redirect: 'manual',
  });

  // Pass response through, but drop length/encoding hints that no
  // longer match because the body is being re-streamed by Vercel.
  const respHeaders = new Headers(upstream.headers);
  respHeaders.delete('content-encoding');
  respHeaders.delete('content-length');
  respHeaders.delete('transfer-encoding');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}
