import React, { useEffect, useState } from "react";
import DestinationService from "../../../../services/DestinationService";
import DestinationCard from "../../../destination/DestinationCard";

export default function DestinationCardId({ id }) {
  const [destination, setDestination] = useState({});
  useEffect(() => {
    const fetchDes = async () => {
      const res = await DestinationService.get(id);
      if (res.status) {
        setDestination(res.data);
      }
    };
    fetchDes();
  }, [id]);
  return <DestinationCard destination={destination} />;
}
