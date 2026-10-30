import Image from "next/image";
import type { CSSProperties } from "react";
import { brandLogo } from "@/lib/brand-logo";
import "./brand-logo.css";

export function BrandLogo({ markOnly = false }: { markOnly?: boolean }) {
  return (
    <span
      className={`brand-logo${markOnly ? " brand-logo-mark" : ""}`}
      style={
        {
          "--logo-image-width": `${(brandLogo.width / brandLogo.crop.size) * 100}%`,
          "--logo-image-left": `${(-brandLogo.crop.x / brandLogo.crop.size) * 100}%`,
          "--logo-image-top": `${(-brandLogo.crop.y / brandLogo.crop.size) * 100}%`,
        } as CSSProperties
      }
    >
      <Image
        src={brandLogo.src}
        alt="Soul Sync logo"
        width={brandLogo.width}
        height={brandLogo.height}
        sizes={markOnly ? "112px" : "280px"}
      />
    </span>
  );
}
