import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineCalendar } from "react-icons/hi2";
import { IoEyeOutline, IoTicketOutline, IoTime } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReviewSession from "../../components/review/ReviewSession";
import { Badge } from "flowbite-react";
import DestinationService from "../../services/DestinationService";
import "../../../public/css/qill-content.css";

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState({});

  useEffect(() => {
    const fetchDestination = async () => {
      const res = await DestinationService.get(id);
      if (res.status) {
        setDestination(res.data);
      }
    };
    fetchDestination();
  }, [id]);

  return (
    <div className="bg-gray-100 w-full">
      <div className="max-w-5xl mx-auto bg-white p-3">
        <div className="flex flex-col gap-3 pt-3">
          <div className="text-center pt-4">
            <h1 className="font-bold text-4xl mb-2">{destination.name}</h1>
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              <Badge color="gray" className="p-2 rounded-full">
                {destination?.category?.categoryId?.name}
              </Badge>
              <Badge color="gray" className="p-2 rounded-full">
                {destination?.category?.subcategoryId?.name}
              </Badge>
            </div>
            <div className="flex flex-row justify-center gap-4">
              <div className="flex flex-row items-center text-sm gap-1">
                <HiOutlineCalendar />
                {new Date(destination.createdAt).toLocaleDateString()}
              </div>
              <div className="flex flex-row items-center text-sm gap-1">
                <IoEyeOutline />
                {destination.views}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row gap-1 items-center">
              <IoTicketOutline />
              {destination?.ticketPrice}{" "}
            </div>
            <div className="flex flex-row gap-1 items-center">
              <IoTime />
              {destination?.openingTime}
            </div>
            <Link
              to={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(
                  [
                    destination?.name,
                    destination?.address?.street,
                    destination?.address?.wardId?.name,
                    destination?.address?.districtId?.name,
                    destination?.address?.provinceId?.name,
                  ]
                    .filter(Boolean)
                    .join(" ")
                )
              }
              target="_blank"
              className="flex flex-row items-center hover:underline-offset-2 hover:text-blue-500"
            >
              <FaMapMarkerAlt className="text-gray-700 mr-1" />
              <p>
                {[
                  destination?.address?.street,
                  destination?.address?.wardId?.name,
                  destination?.address?.districtId?.name,
                  destination?.address?.provinceId?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </Link>
          </div>
        </div>
        <img src={destination.image} className="w-full my-5" />
        <div
          id="qill-content"
          dangerouslySetInnerHTML={{ __html: destination.description }}
        ></div>
        {destination._id && <ReviewSession destinationId={destination._id} />}
      </div>
    </div>
  );
}
