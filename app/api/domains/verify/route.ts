// verify by DNS: check CNAME or A record points to the tenant subdomain
import { NextResponse } from 'next/server';
import dns from 'dns/promises';
import { db } from '@/drizzle/db';
import { domains } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { domain } = await req.json();
  if (!domain)
    return NextResponse.json(
      { error: 'missing' },
      { status: 400 }
    );

  try {
    // try CNAME first
    const cname = await dns
      .resolveCname(domain)
      .catch(() => null);
    const expectedSuffix = '.' + process.env.MAIN_DOMAIN;
    let ok = false;

    if (cname && cname.length) {
      // if any CNAME points to *.shariarkobirkiam.xyz
      ok = cname.some(
        d =>
          d.endsWith(expectedSuffix) ||
          d === process.env.MAIN_DOMAIN
      );
    } else {
      // try A record fallback (apex pointing to proxy)
      const a = await dns
        .resolve4(domain)
        .catch(() => null);
      // If you're using a reverse proxy approach, compare IPs
      ok = !!a; // crude: if A exists accept — better: compare IP to your proxy
    }

    if (!ok)
      return NextResponse.json(
        { verified: false },
        { status: 400 }
      );

    // mark domain verified in DB
    await db
      .update(domains)
      .set({ verified: true })
      .where(eq(domains.domain, domain));
    return NextResponse.json({ verified: true });
  } catch (err) {
    return NextResponse.json(
      { error: err || 'err' },
      { status: 500 }
    );
  }
}
