import {
  FaBed,
  FaCircleCheck,
  FaClock,
  FaHandsPraying,
  FaHouse,
  FaMosque,
  FaRestroom,
  FaShirt,
  FaStar,
  FaSun,
} from "react-icons/fa6";

const byIcon = {
  duar_gurutto: FaHandsPraying,
  zikirer_fozilot: FaStar,
  dua_kobuler_somoy: FaClock,
  jader_dua_kobul_hoy: FaCircleCheck,
  sokal_sondha: FaSun,
  ghum: FaBed,
  poshak: FaShirt,
  bari: FaHouse,
  toilet: FaRestroom,
  azan_ikamot: FaMosque,
};

export function CategoryIcon({ icon, className = "" }) {
  const Icon = byIcon[icon] ?? FaHandsPraying;
  return <Icon aria-hidden className={className} />;
}

export function Logo({ className = "" }) {
  return (
    <span
      className={`grid place-items-center rounded-2xl bg-brand text-white shadow-[0_6px_20px_rgba(31,164,91,0.3)] ${className}`}
    >
      <FaHandsPraying aria-hidden className="size-1/2" />
    </span>
  );
}

// Eight-pointed star (two overlapping squares) with the dua's number inside.
export function DuaBadge({ n }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center text-xs font-semibold text-white">
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 fill-brand"
        aria-hidden
      >
        <rect x="7" y="7" width="22" height="22" rx="2" />
        <rect
          x="7"
          y="7"
          width="22"
          height="22"
          rx="2"
          transform="rotate(45 18 18)"
        />
      </svg>
      <span className="relative">{n}</span>
    </span>
  );
}
