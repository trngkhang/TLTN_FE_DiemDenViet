import React from "react";
import DestinationCardId from "./DestinationCardId";

export default function Hotels({ hotels }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Khách sạn gợi ý</h2>
      <div className="grid grid-cols-1 my-5 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {hotels?.map((hotel, index) => (
          <DestinationCardId key={index} id={hotel?._id} />
        ))}
      </div>
    </div>
  );
}
