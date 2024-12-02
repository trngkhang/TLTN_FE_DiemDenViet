import { useEffect, useState } from "react";
import SubcategoryService from "../../services/SubcategoryService";
import CategoryService from "../../services/CategoryService";
import { Table } from "flowbite-react";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import CreateSubcategory from "../../components/subcategory/CreateSubcategory";
import UpdateSubcategory from "../../components/subcategory/UpdateSubcategory";
import DeleteConfirmModal from "../../components/common/DeleteComfirmModel";

export default function DashSubcategory() {
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [selectedCategory, setSelectedCategory] = useState(""); // State lưu category được chọn
  const [data, setData] = useState([]); // State lưu danh sách subcategory
  const [updateSubcategory, setUpdateSubcategory] = useState(null); // State cập nhật subcategory
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState(""); // State xóa subcategory

  // Lấy danh sách categories
  const fetchCategories = async () => {
    try {
      const res = await CategoryService.gets(); // API lấy danh mục cha
      setCategories(res.data.categories); // Lưu danh mục vào state
    } catch (error) {
      console.log("Lỗi khi fetch danh mục chính:", error);
    }
  };

  // Lấy danh sách subcategories, có thể lọc theo category
  const fetchData = async (categoryId) => {
    try {
      const queryParams = new URLSearchParams({
        categoryId,
        limit: "all",
      }).toString();
      const res = await SubcategoryService.gets(queryParams); // API lấy danh mục con theo category
      setData(res.data.subcategories); // Lưu danh mục con vào state
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  // Xóa subcategory
  const handleDelete = async (id) => {
    try {
      await SubcategoryService.delete(id); // Gọi API xóa
      setDeleteSubcategoryId(null); // Đóng modal
      fetchData(selectedCategory); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.log("Lỗi khi xóa danh mục:", error);
    }
  };

  // Gọi API lấy danh mục cha khi component được mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Gọi API lấy danh sách subcategories khi danh mục cha thay đổi
  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý Danh mục con</h1>
      <div className="flex justify-between items-center mb-4">
        {/* Dropdown chọn danh mục cha */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <CreateSubcategory />
      </div>

      {/* Bảng hiển thị danh sách subcategories */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Danh mục chính</Table.HeadCell>
            <Table.HeadCell>Số điểm đến</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category.name}</Table.Cell>
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
                      onClick={() => setUpdateSubcategory(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500 font-semibold hover:underline"
                      onClick={() => setDeleteSubcategoryId(item._id)}
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

      {/* Modal cập nhật subcategory */}
      {updateSubcategory && (
        <UpdateSubcategory
          item={updateSubcategory}
          onCLose={() => setUpdateSubcategory(null)}
        />
      )}

      {/* Modal xác nhận xóa subcategory */}
      {deleteSubcategoryId && (
        <DeleteConfirmModal
          itemId={deleteSubcategoryId}
          handleDelete={handleDelete}
          onCLose={() => setDeleteSubcategoryId(null)}
        />
      )}
    </div>
  );
}
