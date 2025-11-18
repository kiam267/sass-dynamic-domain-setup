// lib/vercel.ts
import fetch from 'node-fetch';

const VERCEL_TOKEN_SASS = process.env.TOKEN_SASS;
const VERCEL_PROJECT_ID_SASS = process.env.PROJECT_ID_SASS;

export async function addDomainToVercel(domain: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID_SASS}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN_SASS}`,
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
    `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID_SASS}/domains/${domain}`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN_SASS}`,
      },
    }
  );
  return res.json();
}
