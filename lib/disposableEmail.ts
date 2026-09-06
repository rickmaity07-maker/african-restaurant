import disposableDomains from "disposable-email-domains";
import { promises as dns } from "dns";

const blockset = new Set(disposableDomains as string[]);

export async function isDisposableEmail(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return true;

  if (blockset.has(domain)) return true;

  // Defense in depth: reject domains with no mail server at all (common with
  // freshly spun-up throwaway-email sites not yet in the blocklist).
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) return true;
  } catch {
    return true;
  }

  return false;
}
