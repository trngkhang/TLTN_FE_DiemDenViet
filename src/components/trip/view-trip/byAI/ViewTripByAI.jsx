import InfoSession from "../InfoSession";
import ViewTripAction from "../ViewTripAction";
import Hotels from "./Hotels";
import PlacesToVisit from "./PlacesToVisit";

export default function ViewTripByAI({ trip, user }) {
  return (
    <div className="max-w-3xl mx-auto py-10 p-3">
      {/* infomation session */}
      <InfoSession selection={trip?.selection} />
      {/* recomened hotels */}
      <Hotels hotels={trip?.data?.hotelOptions} />
      {/* daily plan */}
      <PlacesToVisit itinerary={trip?.data?.itinerary} />
      {user && user._id === trip.userId && <ViewTripAction itemId={trip._id} />}
    </div>
  );
}
