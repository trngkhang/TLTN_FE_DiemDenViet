import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import envVar from "../../../utils/envVar";

export default function DashDistrict() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`${envVar.api_url}/district`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   Filter data based on the filterText
  const filteredData = data.districts?.filter((item) => {
    return item.name.toLowerCase().includes(filterText.toLowerCase());
  });

  console.log(data.districts);
  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý quận huyện</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    {item.isDeleted ? (
                      <IoClose className="text-red-500" />
                    ) : (
                      <IoCheckmarkSharp className="text-green-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className="inline-flex gap-3">
                    <button className="text-blue-500 font-semibold hover:underline">
                      Sửa
                    </button>
                    <button className="text-red-500 font-semibold hover:underline">
                      Xóa
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center">
                  Không có dữ liệu phù hợp.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
