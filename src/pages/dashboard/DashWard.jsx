import { useEffect, useState } from "react";
import WardService from "../../services/WardService";
import { Table } from "flowbite-react";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import CreateWard from "../../components/ward/CreateWard";
import UpdateWard from "../../components/ward/UpdateWard";
import DeleteConfirmModal from "../../components/common/DeleteComfirmModel";
import SelectProvince from "../../components/address/SelectProvince";
import SelectDistrict from "../../components/address/SelectDistrict";

export default function DashProvince() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const limit = 50; // Số mục trên mỗi trang
  const [updateItem, setUpdateItem] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  const fetchData = async (page, provinceId, districtId) => {
    try {
      const queryParams = new URLSearchParams({
        provinceId,
        districtId,
        page,
        limit,
      }).toString();
      const res = await WardService.gets(queryParams);
      setData(res.data.data);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };
  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedProvince]); // Gọi lại fetchData khi trang thay đổi
  useEffect(() => {
    // Reset trang về 1 khi thay đổi selectedProvince hoặc selectedDistrict
    setCurrentPage(1);
  }, [selectedProvince, selectedDistrict]);
  useEffect(() => {
    fetchData(currentPage, selectedProvince, selectedDistrict);
  }, [currentPage, selectedProvince, selectedDistrict]); // Gọi lại fetchData khi trang thay đổi

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Cập nhật trang hiện tại
  };
  const handleDelete = async (id) => {
    try {
      await WardService.delete(id);
      setDeleteItemId(null);
      fetchData();
    } catch (error) {
      console.log("Lỗi khi xóa:", error);
    }
  };
  console.log(currentPage, totalPages);
  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý phường xã</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <div>
            <SelectProvince
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
            />
          </div>
          <div>
            <SelectDistrict
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
            />
          </div>
        </div>
        <CreateWard />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Tỉnh thành</Table.HeadCell>
            <Table.HeadCell>Quận huyện</Table.HeadCell>
            <Table.HeadCell>Số điển đến</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.province.name}</Table.Cell>
                  <Table.Cell>{item.district.name}</Table.Cell>
                  <Table.Cell>{item.destinationCount}</Table.Cell>
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
                      onClick={() => setUpdateItem(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500 font-semibold hover:underline"
                      onClick={() => setDeleteItemId(item._id)}
                    >
                      Xóa
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center">
                  Không có dữ liệu phù hợp.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Pagination
          count={totalPages || 1} // Tổng số trang
          page={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Hàm thay đổi trang
          className="flex justify-center py-5"
          color="primary"
        />
      </div>
      {updateItem && (
        <UpdateWard item={updateItem} onCLose={() => setUpdateItem(null)} />
      )}
      {deleteItemId && (
        <DeleteConfirmModal
          itemId={deleteItemId}
          handleDelete={handleDelete}
          onCLose={() => setDeleteItemId(null)} // Close modal after delete
        />
      )}
    </div>
  );
}
