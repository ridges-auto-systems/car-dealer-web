interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BMWLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="#0066B2"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="#fff"
        stroke="#000"
        strokeWidth="1"
      />
      <path d="M10 50 L50 10 L90 50 L50 90 Z" fill="#0066B2" />
      <path d="M50 10 L90 50 L50 50 Z" fill="#fff" />
      <path d="M10 50 L50 50 L50 90 Z" fill="#fff" />
      <text
        x="50"
        y="35"
        textAnchor="middle"
        className="text-xs font-bold"
        fill="#000"
      >
        BMW
      </text>
    </svg>
  );
}

export function MercedesLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="#000"
        stroke="#C0C0C0"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="40" fill="#fff" />
      <path d="M50 15 L50 50 L25 75 Z" fill="#000" />
      <path d="M50 15 L50 50 L75 75 Z" fill="#000" />
      <path d="M25 75 L75 75 L50 50 Z" fill="#000" />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ChevroletLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="10" fill="#FFC72C" />
      <path
        d="M20 35 L35 20 L50 35 L65 20 L80 35 L65 50 L50 35 L35 50 Z"
        fill="#000"
      />
      <path
        d="M20 65 L35 50 L50 65 L65 50 L80 65 L65 80 L50 65 L35 80 Z"
        fill="#000"
      />
    </svg>
  );
}

export function ToyotaLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="50"
        cy="50"
        rx="45"
        ry="25"
        fill="none"
        stroke="#E60012"
        strokeWidth="3"
      />
      <ellipse
        cx="35"
        cy="50"
        rx="25"
        ry="35"
        fill="none"
        stroke="#E60012"
        strokeWidth="3"
      />
      <ellipse
        cx="65"
        cy="50"
        rx="25"
        ry="35"
        fill="none"
        stroke="#E60012"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#000"
        strokeWidth="1"
      />
    </svg>
  );
}

export function FerrariLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="5" fill="#FFD700" />
      <path d="M15 25 L50 15 L85 25 L85 75 L50 85 L15 75 Z" fill="#000" />
      <path d="M25 35 L50 30 L75 35 L70 50 L50 55 L30 50 Z" fill="#FFD700" />
      <path d="M40 45 L50 40 L60 45 L55 55 L50 60 L45 55 Z" fill="#E60012" />
    </svg>
  );
}

export function HondaLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="10" fill="#C0C0C0" />
      <path
        d="M20 30 L20 70 L30 70 L30 55 L70 55 L70 70 L80 70 L80 30 L70 30 L70 45 L30 45 L30 30 Z"
        fill="#E60012"
      />
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="35"
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
}

export function AudiLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="50"
        r="15"
        fill="none"
        stroke="#000"
        strokeWidth="3"
      />
      <circle
        cx="40"
        cy="50"
        r="15"
        fill="none"
        stroke="#000"
        strokeWidth="3"
      />
      <circle
        cx="60"
        cy="50"
        r="15"
        fill="none"
        stroke="#000"
        strokeWidth="3"
      />
      <circle
        cx="75"
        cy="50"
        r="15"
        fill="none"
        stroke="#000"
        strokeWidth="3"
      />
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="10"
        fill="none"
        stroke="#C0C0C0"
        strokeWidth="1"
      />
    </svg>
  );
}

export function FordLogo({
  className = "",
  width = 60,
  height = 60,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="50" cy="50" rx="45" ry="25" fill="#003399" />
      <path
        d="M25 40 L25 45 L40 45 L40 50 L30 50 L30 55 L40 55 L40 60 L25 60 L25 65 L45 65 L45 40 Z"
        fill="#fff"
      />
      <path
        d="M50 40 L50 65 L70 65 C75 65 75 40 70 40 Z M55 45 L65 45 C70 45 70 60 65 60 L55 60 Z"
        fill="#fff"
      />
    </svg>
  );
}

// Brand data with components
export const brandLogos = [
  {
    name: "BMW",
    component: BMWLogo,
    count: "25+",
  },
  {
    name: "Mercedes-Benz",
    component: MercedesLogo,
    count: "30+",
  },
  {
    name: "Chevrolet",
    component: ChevroletLogo,
    count: "40+",
  },
  {
    name: "Toyota",
    component: ToyotaLogo,
    count: "50+",
  },
  {
    name: "Ferrari",
    component: FerrariLogo,
    count: "5+",
  },
  {
    name: "Honda",
    component: HondaLogo,
    count: "35+",
  },
  {
    name: "Audi",
    component: AudiLogo,
    count: "20+",
  },
  {
    name: "Ford",
    component: FordLogo,
    count: "45+",
  },
];
