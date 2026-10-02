import { People } from "@/components/people";
export default function Connections() {
  return (
    <>
      <div className="simple-intro">
        <span className="eyebrow">THE PEOPLE THAT CAUGHT YOUR EYE</span>
        <h1>
          A little spark.
          <br />
          <em>A growing circle.</em>
        </h1>
        <p>
          There’s room for more than one hello. Get to know people at your own
          pace.
        </p>
      </div>
      <People mode="connections" />
    </>
  );
}
