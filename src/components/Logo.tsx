import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "https://www.coordinators.pro", white = false }: { href?: string; white?: boolean }) {
  return (
    <Link href={href} className="flex items-center shrink-0">
      <Image
        src="https://careers.coordinators.pro/logo.png"
        alt="Coordinators.pro"
        width={180}
        height={44}
        priority
        className={`h-9 w-auto${white ? " brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
