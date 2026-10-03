import { People } from "@/components/people";
import { Icon } from "@/components/icon";
export default function Connections() {
  return (
    <>
      <div className="simple-intro connections-intro">
        <div className="space-intro-symbol" aria-hidden="true">
          <Icon name="heart" size={135} />
        </div>
        <div className="space-intro-copy">
          <span className="eyebrow">THE PEOPLE THAT CAUGHT YOUR EYE</span>
          <h1>
            Your circle.
            <br />
            <em>Your pace.</em>
          </h1>
          <p>
            There’s room for more than one hello. Get to know people at your own
            pace.
          </p>
        </div>
      </div>
      <People mode="connections" />
    </>
  );
}
