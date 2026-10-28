import Image from "next/image";
import "./brand-logo.css";

export function BrandLogo({ markOnly = false }: { markOnly?: boolean }) {
  return (
    <span className={`brand-logo${markOnly ? " brand-logo-mark" : ""}`}>
      <Image
        src="/images/soul-sync-logo.jpeg"
        alt="Soul Kink logo"
        width={759}
        height={1280}
        sizes={markOnly ? "112px" : "250px"}
      />
    </span>
  );
}
