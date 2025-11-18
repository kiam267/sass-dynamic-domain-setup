// pages/api/projects/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/drizzle/db';
import { projects } from '@/drizzle/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();
  const { owner_id, name, slug } = req.body;
  if (!owner_id || !name || !slug)
    return res
      .status(400)
      .json({ error: 'owner_id, name, slug required' });

  const subdomain = `${slug}.${process.env.APP_ROOT_DOMAIN}`;

  try {
    const insert = await db
      .insert(projects)
      .values({
        owner_id: Number(owner_id),
        name,
        slug,
        primary_domain: subdomain,
      })
      .returning();
    return res.status(201).json({ project: insert[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
