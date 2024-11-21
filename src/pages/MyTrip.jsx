import { useSelector } from "react-redux";
import envVar from "../utils/envVar";
import { useEffect, useState } from "react";
import UserTripCardItem from "../components/user-trip/UserTripCardItem";

export default function MyTrip() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [userTrips, setUserTrips] = useState([]);

  const getUserTrips = async () => {
    try {
      const res = await fetch(
        `${envVar.api_url}/trip?userId=${user._id}&isDeleted=false`
      );
      const data = await res.json();
      if (res.ok) {
        setUserTrips(data.trips);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUserTrips();
  }, []);
  console.log(userTrips.length);
  return (
    <div className="max-w-4xl mx-auto py-10 p-3">
      <div className="flex flex-row text-xl gap-2">
        <h1 className="text-2xl font-semibold">CHUYẾN ĐI ĐÃ TẠO</h1>
        <span className="border border-black px-1 m-0">{userTrips.length}</span>
      </div>

      <div className="justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-5">
        {userTrips.map((trip, index) => (
          <UserTripCardItem trip={trip} key={index} />
        ))}
      </div>
    </div>
  );
}
