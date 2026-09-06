"use client";
import { SessionProvider } from "next-auth/react";
import { ConsentProvider } from "@/lib/consent";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConsentProvider>
        {children}
        <CookieConsentBanner />
      </ConsentProvider>
    </SessionProvider>
  );
}
