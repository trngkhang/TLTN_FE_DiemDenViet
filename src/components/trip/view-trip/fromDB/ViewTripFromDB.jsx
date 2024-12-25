import InfoSession from "../InfoSession";
import ViewTripAction from "../ViewTripAction";
import Hotels from "./Hotels";
import PlanToVisit from "./PlanToVisit";

export default function ViewTripFromDB({ trip, user }) {
  return (
    <div className="max-w-3xl mx-auto py-10 p-3">
      {/* infomation session */}
      <InfoSession selection={trip?.selection} />
      <Hotels hotels={trip?.data?.hotels} />
      {<PlanToVisit plan={trip?.data?.itinerary} />}
      {user && user._id === trip.userId && <ViewTripAction itemId={trip._id} />}
    </div>
  );
}
