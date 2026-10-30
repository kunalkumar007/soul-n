import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brandLogo } from "@/lib/brand-logo";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const image = await readFile(
    join(process.cwd(), "public", brandLogo.src.slice(1)),
  );
  const scale = size.width / brandLogo.crop.size;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ImageResponse needs embedded image data rather than next/image. */}
      <img
        src={`data:image/png;base64,${image.toString("base64")}`}
        alt=""
        width={brandLogo.width * scale}
        height={brandLogo.height * scale}
        style={{
          position: "absolute",
          left: -brandLogo.crop.x * scale,
          top: -brandLogo.crop.y * scale,
        }}
      />
    </div>,
    size,
  );
}
