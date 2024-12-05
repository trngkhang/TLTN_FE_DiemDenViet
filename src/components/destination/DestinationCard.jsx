import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destination/${destination._id}`}>
      <div className="max-w-sm min-h-80 bg-white border border-gray-200 rounded-lg shadow hover:scale-[101%] hover:-translate-y-2 transition-transform duration-200">
        <img className="rounded-t-lg aspect-video" src={destination.image} />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
            {destination.name}
          </h5>
        </div>
      </div>
    </Link>
  );
}
