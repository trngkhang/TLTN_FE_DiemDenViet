import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel?.name +
        " " +
        hotel?.address
      }
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src="/img_trip.webp"
          alt="hotel"
          className="rounded-xl h-[180px] w-full object-cover"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.name}</h2>
          <h2 className="text-xs text-gray-500 ">📍 {hotel?.address}</h2>
          <h2 className="text-sm">💰 {hotel?.price}</h2>
          <h2 className="text-sm">⭐ {hotel?.rating} sao</h2>
        </div>
      </div>
    </Link>
  );
}
