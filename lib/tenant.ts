// lib/tenant.ts
import { db } from '@/drizzle/db';
import { users, tenants, domains } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 63);
}

export async function createUserAndTenant({
  email,
  passwordHash,
  tenantName,
}: {
  email: string;
  passwordHash: string;
  tenantName: string;
}) {
  // create user
  const userRes = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning();
  const user = userRes[0];

  // slug
  let base = slugify(tenantName || email.split('@')[0]);
  if (!base) base = `u-${randomUUID().slice(0, 6)}`;

  // ensure unique slug (simple loop)
  let slug = base;
  let i = 0;
  while (true) {
    const exists = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1);
    if (!exists.length) break;
    i++;
    slug = `${base}-${i}`;
  }

  const tenantRes = await db
    .insert(tenants)
    .values({
      userId: user.id,
      name: tenantName || email,
      slug,
    })
    .returning();
  const tenant = tenantRes[0];

  // create internal subdomain record: `${slug}.shariarkobirkiam.xyz`
  const internalDomain =
    `${slug}.` + process.env.MAIN_DOMAIN;
  await db.insert(domains).values({
    tenantId: tenant.id,
    domain: internalDomain,
    isPrimary: true,
    verified: true,
  });

  return { user, tenant, domain: internalDomain };
}

export async function getTenantByHost(host: string) {
  const rows = await db
    .select()
    .from(domains)
    .where(eq(domains.domain, host))
    .limit(1);
  if (rows.length) return rows[0];
  return null;
}
