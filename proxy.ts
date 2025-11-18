// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantByHost } from '@/lib/tenant';

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host')?.split(':')[0] || '';

  const MAIN = process.env.MAIN_DOMAIN!; // example: shariarkobirkiam.xyz
  const APP = `app.${MAIN}`; // optional dashboard domain
  const WWW = `www.${MAIN}`; // if you use www

  // 1️⃣ Allow main domain and marketing site
  if (host === MAIN || host === WWW || host === APP) {
    return NextResponse.next();
  }

  // 2️⃣ Check if host exists in database (tenant or custom domain)
  const tenant = await getTenantByHost(host);

  if (!tenant) {
    // unknown domain → show 404 or redirect to main site
    return NextResponse.rewrite(
      new URL('/not-found', req.url)
    );
  }

  // 3️⃣ Everything matched → pass tenant info to Next.js
  const res = NextResponse.next();

  // You will use this in pages/server actions via request headers
  res.headers.set('x-tenant-id', String(tenant.id));
  // res.headers.set('x-tenant-slug', tenant.slug);
  res.headers.set('x-tenant-domain', tenant.domain);

  return res;
}

// Must define matcher for all pages except static files and APIs
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
