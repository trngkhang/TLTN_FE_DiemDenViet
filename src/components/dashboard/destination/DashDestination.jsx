import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../../utils/envVar";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";

export default function DashDestination() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${envVar.api_url}/destination`);
      const result = await response.json();
      setData(result.destinations);
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.introduce.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý loại điểm đến</h1>
      <div className="flex justify-between items-center mb-4">
        <button className="text-blue-500 font-semibold p-2">Tạo mới</button>
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
            <Table.HeadCell>Giới thiệu</Table.HeadCell>
            <Table.HeadCell>Lượt xem</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Table.Row key={index} className="justify-self-center">
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={item.image}
                      alt="image"
                      className="aspect-video object-cover  h-16  min-w-16"
                    />
                  </Table.Cell>
                  <Table.Cell>{item.views}</Table.Cell>
                  <Table.Cell>
                    {item.isDeleted ? (
                      <IoClose className="text-red-500" />
                    ) : (
                      <IoCheckmarkSharp className="text-green-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className="inline-flex gap-3">
                    <button
                      className="text-blue-500 font-semibold hover:underline"
                      onClick={() => handleEditModal(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500 font-semibold hover:underline"
                      onClick={() => openDeleteModal(item._id)}
                    >
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
