// pages/api/domains/attach.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/drizzle/db';
import { projects, domains } from '@/drizzle/schema';
import { checkCNAME } from '@/lib/dns';
import { addDomainToVercel } from '@/lib/vercel';
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();
  const { project_id, domain } = req.body;
  if (!project_id || !domain)
    return res
      .status(400)
      .json({ error: 'project_id & domain required' });

  // 1) find project
  const proj = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(project_id)))
    .limit(1);
  if (!proj || proj.length === 0)
    return res
      .status(404)
      .json({ error: 'project not found' });
  const project = proj[0];

  // expected target
  const expected = `${project.slug}.${process.env.APP_ROOT_DOMAIN}`;

  // 2) check CNAME
  const ok = await checkCNAME(domain, expected);
  if (!ok)
    return res.status(400).json({
      error: `Please point CNAME of ${domain} to ${expected}`,
    });

  // 3) add to Vercel
  try {
    const vercelResp = await addDomainToVercel(domain);
    // 4) persist
    await db.insert(domains).values({
      project_id: Number(project_id),
      domain,
      verified: 'true',
    });

    // update project's primary domain
    await db
      .update(projects)
      .set({ primary_domain: domain })
      .where(eq(projects.id, Number(project_id)));

    return res.status(200).json({
      message: 'domain attached',
      vercel: vercelResp,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
