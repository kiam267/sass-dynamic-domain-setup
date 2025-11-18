import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { domains } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.json();
  const { tenantId, customDomain } = body;
  if (!tenantId || !customDomain)
    return NextResponse.json(
      { error: 'missing' },
      { status: 400 }
    );

  // Save the domain as unverified
  const res = await db
    .insert(domains)
    .values({
      tenantId,
      domain: customDomain,
      isPrimary: false,
      verified: false,
    })
    .returning();
  return NextResponse.json({ ok: true, domain: res[0] });
}
