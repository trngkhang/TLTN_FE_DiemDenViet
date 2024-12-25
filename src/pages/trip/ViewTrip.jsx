import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripService from "../../services/TripService";
import { useSelector } from "react-redux";
import ViewTripByAI from "../../components/trip/view-trip/byAI/ViewTripByAI";
import ViewTripFromDB from "../../components/trip/view-trip/fromDB/ViewTripFromDB";

export default function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const getTripData = async () => {
    try {
      const res = await TripService.get(tripId);

      if (res.status) {
        setTrip(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);
  if (trip?.type === "byAI") {
    return <ViewTripByAI trip={trip} user={user} />;
  }
  if (trip?.type === "fromDB") {
    return <ViewTripFromDB trip={trip} user={user} />;
  }
}
