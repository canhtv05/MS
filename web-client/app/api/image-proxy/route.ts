import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = ['http://localhost:9000', 'http://127.0.0.1:9000'];

function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const origin = `${parsed.protocol}//${parsed.host}`;
    if (ALLOWED_ORIGINS.some(o => origin === o)) return true;
    if (parsed.hostname === 'localhost' && parsed.port === '9000') return true;
    return false;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  const decoded = decodeURIComponent(url);
  if (!isAllowedImageUrl(decoded)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const res = await fetch(decoded, {
      headers: { Accept: 'image/*' },
      cache: 'force-cache',
    });
    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }
    const contentType = res.headers.get('content-type') || 'image/*';
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    console.error('[image-proxy]', e);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }
}
