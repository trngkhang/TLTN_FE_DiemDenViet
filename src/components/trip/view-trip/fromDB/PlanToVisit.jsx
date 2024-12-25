import React from "react";
import DestinationCardId from "./DestinationCardId";
import { Accordion } from "flowbite-react";

export default function PlanToVisit({ plan }) {
  // Helper to render destinations by time of day
  const renderDestinations = (destinations) =>
    destinations.map((destination) => (
      <DestinationCardId key={destination?._id} id={destination?._id} />
    ));

  return (
    <div>
      <h2 className="font-bold text-xl pb-3">Điểm đến gợi ý</h2>
      <Accordion alwaysOpen={true}>
        {plan?.map((dayPlan, index) => (
          <Accordion.Panel key={index}>
            <Accordion.Title className="text-xl font-bold">
              {dayPlan?.day}
            </Accordion.Title>
            <Accordion.Content>
              <h3 className="text-xl font-semibold">Buổi sáng</h3>
              <div className="grid grid-cols-1 my-5 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {renderDestinations(dayPlan.morning)}
              </div>
              <h3 className="text-xl font-semibold">Buổi chiều</h3>
              <div className="grid grid-cols-1 my-5 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {renderDestinations(dayPlan.afternoon)}
              </div>
              <h3 className="text-xl font-semibold">Buổi tối</h3>
              <div className="grid grid-cols-1 my-5 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {renderDestinations(dayPlan.evening)}
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    </div>
  );
}
