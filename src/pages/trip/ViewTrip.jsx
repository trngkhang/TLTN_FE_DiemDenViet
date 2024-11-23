import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import envVar from "../../utils/envVar";
import InfoSession from "../../components/trip/view-trip/InfoSession";
import Hotels from "../../components/trip/view-trip/Hotels";
import PlacesToVisit from "../../components/trip/view-trip/PlacesToVisit";
import ViewTripAction from "../../components/trip/view-trip/ViewTripAction";

export default function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  const getTripData = async () => {
    try {
      const res = await fetch(`${envVar.api_url}/trip/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setTrip(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);

  return (
    <div className="max-w-3xl mx-auto py-10 p-3">
      {/* infomation session */}
      <InfoSession selection={trip.selection} />
      {/* recomened hotels */}
      <Hotels hotels={trip?.data?.hotelOptions} />
      {/* daily plan */}
      <PlacesToVisit itinerary={trip?.data?.itinerary} />
      <ViewTripAction itemId={tripId} />
    </div>
  );
}
