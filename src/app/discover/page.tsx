import { People } from "@/components/people";
import Image from "next/image";
export default function Discover() {
  return (
    <>
      <div className="simple-intro discovery-intro">
        <div className="space-intro-visual" aria-hidden="true">
          <Image
            src="/images/lounge-hero.webp"
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            preload
          />
        </div>
        <div className="space-intro-copy">
          <span className="eyebrow">A HELLO CAN CHANGE EVERYTHING</span>
          <h1>
            Make room for
            <br />
            <em>someone new.</em>
          </h1>
          <p>Follow your curiosity. Your next connection might surprise you.</p>
        </div>
      </div>
      <People mode="discover" />
    </>
  );
}
