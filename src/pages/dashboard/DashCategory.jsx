import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { Table } from "flowbite-react";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import CreateCategory from "../../components/category/CreateCategory";
import UpdateCategory from "../../components/category/UpdateCategory";
import DeleteConfirmModal from "../../components/common/DeleteComfirmModel";

export default function DashCategory() {
  const [data, setData] = useState([]);
  const [updateCategory, setUpdateCategory] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");

  const fetchData = async () => {
    try {
      const res = await CategoryService.gets();
      setData(res.data.categories);
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await CategoryService.delete(id);
      setDeleteCategoryId(null);
      fetchData();
    } catch (error) {
      console.log("Lỗi khi xóa danh mục:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý Danh mục chính</h1>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <CreateCategory />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Số danh mục con</Table.HeadCell>
            <Table.HeadCell>Số điển đến</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.subcategoryCount}</Table.Cell>
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
                      onClick={() => setUpdateCategory(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500 font-semibold hover:underline"
                      onClick={() => setDeleteCategoryId(item._id)}
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
      {updateCategory && (
        <UpdateCategory
          item={updateCategory}
          onCLose={() => setUpdateCategory(null)}
        />
      )}
      {deleteCategoryId && (
        <DeleteConfirmModal
          itemId={deleteCategoryId}
          handleDelete={handleDelete}
          onCLose={() => setDeleteCategoryId(null)} // Close modal after delete
        />
      )}
    </div>
  );
}
