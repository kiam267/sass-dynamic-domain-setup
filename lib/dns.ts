import dns from 'dns/promises';

export async function verifyDomain(
  domain: string,
  expectedToken: string
) {
  try {
    const records = await dns.resolveTxt(domain);
    const flat = records.map(r => r.join(''));

    return flat.includes(expectedToken);
  } catch (e) {
    return false;
  }
}
