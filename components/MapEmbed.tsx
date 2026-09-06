import { restaurantInfo } from "@/lib/menuData";

export default function MapEmbed() {
  return (
    <a
      href={restaurantInfo.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative w-full h-52 sm:h-64 md:h-80 border border-white/10 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden group"
      aria-label={`Open ${restaurantInfo.name} in Google Maps`}
    >
      <iframe
        src={restaurantInfo.mapsEmbedUrl}
        className="w-full h-full pointer-events-none"
        loading="lazy"
        title={`${restaurantInfo.name} location`}
      />
      <div className="absolute inset-0 flex items-end justify-start p-3 sm:p-4 bg-linear-to-t from-black/70 to-transparent">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold group-hover:text-white transition-colors">
          Open in Google Maps ↗
        </span>
      </div>
    </a>
  );
}