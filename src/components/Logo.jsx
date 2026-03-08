const Logo = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    {/* Rounded square bg */}
    <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
    {/* Grid of 4 dots representing nodes */}
    <circle cx="13" cy="13" r="3.5" fill="white" opacity="0.95" />
    <circle cx="27" cy="13" r="3.5" fill="white" opacity="0.95" />
    <circle cx="13" cy="27" r="3.5" fill="white" opacity="0.95" />
    <circle cx="27" cy="27" r="3.5" fill="white" opacity="0.95" />
    {/* Connecting lines (grid pattern) */}
    <line x1="13" y1="16.5" x2="13" y2="23.5" stroke="white" strokeWidth="1.5" opacity="0.55" />
    <line x1="27" y1="16.5" x2="27" y2="23.5" stroke="white" strokeWidth="1.5" opacity="0.55" />
    <line x1="16.5" y1="13" x2="23.5" y2="13" stroke="white" strokeWidth="1.5" opacity="0.55" />
    <line x1="16.5" y1="27" x2="23.5" y2="27" stroke="white" strokeWidth="1.5" opacity="0.55" />
    {/* Diagonal cross connecting all nodes */}
    <line x1="15.5" y1="15.5" x2="24.5" y2="24.5" stroke="white" strokeWidth="1.2" opacity="0.35" />
    <line x1="24.5" y1="15.5" x2="15.5" y2="24.5" stroke="white" strokeWidth="1.2" opacity="0.35" />
  </svg>
);

export default Logo;
