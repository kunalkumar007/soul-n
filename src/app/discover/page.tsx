import { People } from "@/components/people";
export default function Discover() {
  return (
    <>
      <div className="simple-intro">
        <span className="eyebrow">A HELLO CAN CHANGE EVERYTHING</span>
        <h1>
          Make room for
          <br />
          <em>someone new.</em>
        </h1>
        <p>Follow your curiosity. Your next connection might surprise you.</p>
      </div>
      <People mode="discover" />
    </>
  );
}
