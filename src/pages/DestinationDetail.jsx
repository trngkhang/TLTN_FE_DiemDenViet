import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import envVar from "../utils/envVar";
import { HiOutlineCalendar } from "react-icons/hi2";
import { IoEyeOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReviewSession from "../components/ReviewSession";

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState({});

  useEffect(() => {
    const fetchDestination = async () => {
      const res = await fetch(`${envVar.api_url}/destination/${id}`);
      const data = await res.json();
      if (res.ok) {
        setDestination(data);
      }
    };
    fetchDestination();
  }, [id]);

  return (
    <div className="bg-gray-100 w-full">
      <div className="max-w-5xl mx-auto bg-white p-3">
        <div className="flex flex-col gap-3 pt-5">
          <h1 className="font-semibold text-3xl">{destination.name}</h1>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center text-sm gap-1">
              <HiOutlineCalendar />
              {new Date(destination.createdAt).toLocaleDateString()}
            </div>
            <div className="flex flex-row items-center text-sm gap-1">
              <IoEyeOutline />
              {destination.views}
            </div>
          </div>
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" +
              destination.name +
              " " +
              destination.address
            }
            target="_blank"
            className="flex flex-row items-center hover:underline-offset-2 hover:text-blue-500"
          >
            <FaMapMarkerAlt className="text-gray-700 mr-1" />
            {destination.address}
          </Link>
          <p>{destination.introduce}</p>
        </div>
        <img src={destination.image} className="max-w-3xl mx-auto my-5" />
        <div
          dangerouslySetInnerHTML={{ __html: destination.description }}
        ></div>
        {destination._id && <ReviewSession destinationId={destination._id} />}{" "}
      </div>
    </div>
  );
}
