import { useEffect, useState } from "react";
import DistrictService from "../../services/DistrictService";
import { Table } from "flowbite-react";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import CreateDistrict from "../../components/district/CreateDistrict";
import UpdateDistrict from "../../components/district/UpdateDistrict";
import DeleteConfirmModal from "../../components/common/DeleteComfirmModel";
import SelectProvince from "../../components/address/SelectProvince";

export default function DashDistrict() {
  const [selectedProvince, setSelectedProvince] = useState(""); // State lưu category được chọn
  const [data, setData] = useState([]); // State lưu danh sách district
  const [updateItem, setUpdateItem] = useState(null); // State cập nhật district
  const [deleteItemId, setDeleteItemId] = useState(""); // State xóa district

  // Lấy danh sách subcategories, có thể lọc theo category
  const fetchData = async (provinceId) => {
    try {
      const queryParams = new URLSearchParams({
        provinceId,
        limit: "all",
      }).toString();
      const res = await DistrictService.gets(queryParams); // API lấy danh mục con theo category
      setData(res.data.districts); // Lưu danh mục con vào state
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  // Xóa district
  const handleDelete = async (id) => {
    try {
      await DistrictService.delete(id); // Gọi API xóa
      setDeleteItemId(null); // Đóng modal
      fetchData(selectedProvince); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.log("Lỗi khi xóa:", error);
    }
  };

  // Gọi API lấy danh sách subcategories khi danh mục cha thay đổi
  useEffect(() => {
    fetchData(selectedProvince);
  }, [selectedProvince]);

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý Quận huyện</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <SelectProvince
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
          />
        </div>
        <CreateDistrict />
      </div>

      {/* Bảng hiển thị danh sách subcategories */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Tỉnh thành</Table.HeadCell>
            <Table.HeadCell>Số điểm đến</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.province.name}</Table.Cell>
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
                <Table.Cell colSpan="5" className="text-center">
                  Không có dữ liệu phù hợp.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Modal cập nhật district */}
      {updateItem && (
        <UpdateDistrict item={updateItem} onCLose={() => setUpdateItem(null)} />
      )}

      {/* Modal xác nhận xóa district */}
      {deleteItemId && (
        <DeleteConfirmModal
          itemId={deleteItemId}
          handleDelete={handleDelete}
          onCLose={() => setDeleteItemId(null)}
        />
      )}
    </div>
  );
}
