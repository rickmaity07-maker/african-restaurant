"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-200 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">
        Error
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
        Something went wrong
      </h1>
      <p className="text-stone-400 max-w-md mb-8">
        We hit an unexpected error. Please try again — if this keeps
        happening, contact us directly.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-full border border-amber-500/30 px-6 py-3 text-sm hover:bg-amber-500 hover:text-black transition-all duration-300"
      >
        Try again
      </button>
    </main>
  );
}
