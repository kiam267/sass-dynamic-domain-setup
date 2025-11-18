// lib/dns.ts
import dns from 'dns/promises';

export async function checkCNAME(
  domain: string,
  expectedTarget: string
) {
  try {
    const records = await dns.resolveCname(domain);
    return records.includes(expectedTarget);
  } catch (err: any) {
    // No CNAME record or other error
    return false;
  }
}
