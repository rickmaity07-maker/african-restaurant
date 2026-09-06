import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-200 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-amber-500 tracking-[0.3em] uppercase text-sm mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
        Page not found
      </h1>
      <p className="text-stone-400 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full border border-amber-500/30 px-6 py-3 text-sm hover:bg-amber-500 hover:text-black transition-all duration-300"
      >
        Back to home
      </Link>
    </main>
  );
}
