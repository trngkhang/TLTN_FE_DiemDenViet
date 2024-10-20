import { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import envVar from "../utils/envVar";
import { Autocomplete, Pagination, TextField } from "@mui/material";
import DestinationCard from "../components/DestinationCard";

export default function Destination() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [destinationTypes, setDestinationTypes] = useState([]);
  const [filter, setFilter] = useState({
    searchTerm: "",
    provinceId: "",
    destinationTypeId: "",
  });
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 12; // hoặc giá trị khác tùy ý

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchTerm: filter.searchTerm,
        provinceId: filter.provinceId,
        destinationTypeId: filter.destinationTypeId,
        startIndex: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      }).toString();

      const res = await fetch(`${envVar.api_url}/destination?${queryParams}`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setDestinations(data.destinations);
        setTotalPages(Math.ceil(data.totalDestinations / itemsPerPage)); // Cập nhật số trang tổng
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchRegions = async () => {
      const res = await fetch(`${envVar.api_url}/regions`);
      const data = await res.json();
      const arrRegions = data.regions.map((region) => ({
        label: region.name,
        id: region._id,
      }));
      setRegions(arrRegions);
    };
    fetchRegions();

    const fetchProvinces = async () => {
      const res = await fetch(`${envVar.api_url}/provinces`);
      const data = await res.json();
      const arrProvinces = data.provinces.map((province) => ({
        label: province.name,
        id: province._id,
      }));
      setProvinces(arrProvinces);
    };
    fetchProvinces();

    const fetchDestinationTypes = async () => {
      const res = await fetch(`${envVar.api_url}/destination-type`);
      const data = await res.json();
      const arrDestinationTypes = data.destinationTypes.map(
        (destinationType) => ({
          label: destinationType.name,
          id: destinationType._id,
        })
      );
      setDestinationTypes(arrDestinationTypes);
    };
    fetchDestinationTypes();

    handleSearch();
  }, [filter, currentPage]); // Thêm currentPage vào dependencies

  return (
    <div className="bg-gray-100 w-full py-1">
      <div className="max-w-6xl bg-white mx-auto min-h-screen gap-3 p-3">
        <div>
          {/* search and filter */}
          <div>
            <div className="max-w-2xl mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              ></label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm điểm đến"
                  required
                  onChange={(e) =>
                    setFilter({ ...filter, searchTerm: e.target.value })
                  }
                />

                <button
                  onClick={handleSearch}
                  className="text-white absolute end-2.5 bottom-2.5 bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-3">
              <Autocomplete
                size="small"
                disablePortal
                options={provinces}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Tỉnh thành" />
                )}
                onChange={(event, value) => {
                  if (value) {
                    setFilter({ ...filter, provinceId: value.id });
                  }
                }}
              />
              <Autocomplete
                size="small"
                disablePortal
                options={destinationTypes}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Loại điểm đến" />
                )}
                onChange={(event, value) => {
                  if (value) {
                    setFilter({ ...filter, destinationTypeId: value.id });
                  }
                }}
              />
            </div>
          </div>
          <Dropdown label="Sắp xếp theo:" inline className="mr-0">
            <Dropdown.Item>Đánh giá</Dropdown.Item>
            <Dropdown.Item>Lượt xem</Dropdown.Item>
          </Dropdown>
        </div>
        {/* results */}
        <div className="mt-5">
          {destinations.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 justify-items-center">
                {destinations.map((destination, index) => (
                  <DestinationCard destination={destination} key={index} />
                ))}
              </div>
              <div className="flex justify-center py-6 mt-2">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => {
                    setCurrentPage(value);
                  }}
                  color="primary"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2>Không có tìm thấy điểm đến nào.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
