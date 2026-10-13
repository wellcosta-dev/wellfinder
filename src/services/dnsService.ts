import { DnsRecord } from '../types/ip';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

export async function fetchLiveDnsRecords(target: string): Promise<DnsRecord[]> {
  const cleanTarget = target.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  if (!cleanTarget) return [];

  // Check if target is an IP (IPv4 or IPv6)
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanTarget) || cleanTarget.includes(':');
  
  if (isIp) {
    // For IP, attempt reverse DNS (PTR)
    try {
      let ptrName = '';
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanTarget)) {
        ptrName = cleanTarget.split('.').reverse().join('.') + '.in-addr.arpa';
      } else {
        // Fallback for general IP
        return [
          { type: 'A', value: cleanTarget, ttl: 300 }
        ];
      }

      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(ptrName)}&type=PTR`, {
        headers: { accept: 'application/dns-json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.Answer && data.Answer.length > 0) {
          return data.Answer.map((ans: any) => ({
            type: 'PTR',
            value: ans.data?.replace(/\.$/, '') || '',
            ttl: ans.TTL
          }));
        }
      }
    } catch {
      // Fallback
    }

    return [
      { type: 'A', value: cleanTarget, ttl: 300 }
    ];
  }

  // Domain lookup: query multiple common record types in parallel
  const records: DnsRecord[] = [];
  try {
    const promises = RECORD_TYPES.map(async (type) => {
      try {
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanTarget)}&type=${type}`, {
          headers: { accept: 'application/dns-json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        if (data.Answer && Array.isArray(data.Answer)) {
          return data.Answer.map((ans: any) => ({
            type,
            value: ans.data?.replace(/^"|"$/g, '').replace(/\.$/, '') || '',
            ttl: ans.TTL
          }));
        }
        return [];
      } catch {
        return [];
      }
    });

    const results = await Promise.all(promises);
    for (const group of results) {
      records.push(...group);
    }
  } catch (err) {
    console.warn('DNS lookup failed:', err);
  }

  // Return real found records, or empty array if domain does not exist or has no records
  return records;
}

