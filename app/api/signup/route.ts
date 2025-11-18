// app/api/signup/route.ts (Next.js app router API)
import { NextResponse } from 'next/server';
import { createUserAndTenant } from '@/lib/tenant';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password)
    return NextResponse.json(
      { error: 'missing' },
      { status: 400 }
    );

  // hash password — use bcrypt
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.hash(password, 10);

  const tenantName = body.tenantName || email.split('@')[0];
  const { user, tenant, domain } =
    await createUserAndTenant({
      email,
      passwordHash: hash,
      tenantName,
    });

  return NextResponse.json({
    ok: true,
    userId: user.id,
    tenantId: tenant.id,
    domain,
  });
}
