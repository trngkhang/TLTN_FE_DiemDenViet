import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/destination/${destination._id}`}>
      <div class="max-w-sm min-h-80 bg-white border border-gray-200 rounded-lg shadow hover:scale-[101%] hover:-translate-y-2 transition-transform duration-200">
        <img class="rounded-t-lg aspect-video" src={destination.image} />
        <div class="p-5">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
            {destination.name}
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
            {destination.introduce}
          </p>
        </div>
      </div>
    </Link>
  );
}
