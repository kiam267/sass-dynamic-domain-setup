// lib/vercel.ts
import fetch from 'node-fetch';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function addDomainToVercel(domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export async function getDomainFromVercel(domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}`,
    {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    }
  );
  return res.json();
}
