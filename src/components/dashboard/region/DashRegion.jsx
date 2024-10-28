import { useState, useEffect } from "react";
import envVar from "../../../utils/envVar";
import { Table } from "flowbite-react";
import DeleteConfirmModal from "../../DeleteComfirmModel";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import CreateRegionModal from "./CreateRegionModal";
import EditRegionModal from "./EditRegionModal";

export default function DashRegion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null); // State for selected item to edit
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${envVar.api_url}/regions`);
      const result = await response.json();
      setData(result.regions);
    } catch (error) {
      console.log("Lỗi khi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${envVar.api_url}/regions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedItemId(id);
    setOpenModalDelete(true);
  };

  const handleCreateModal = () => {
    setOpenModalCreate(true);
  };

  const handleEditModal = (item) => {
    setSelectedRegion(item);
    setOpenModalEdit(true);
  };

  // Filter data based on the filterText
  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.isDeleted ? "Khóa" : "Không khóa")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý khu vực</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-blue-500 font-semibold p-2"
          onClick={handleCreateModal}
        >
          Tạo mới
        </button>
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
            <Table.HeadCell>Mô tả</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <p className="line-clamp-2">{item.description}</p>
                  </Table.Cell>
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

      {openModalDelete && (
        <DeleteConfirmModal
          openModalDelete={openModalDelete}
          setOpenModalDelete={setOpenModalDelete}
          handleDelete={handleDelete}
          itemId={selectedItemId}
        />
      )}

      <CreateRegionModal
        openModal={openModalCreate}
        setOpenModal={setOpenModalCreate}
      />

      {openModalEdit && selectedRegion && (
        <EditRegionModal
          openModal={openModalEdit}
          setOpenModal={setOpenModalEdit}
          item={selectedRegion}
        />
      )}
    </div>
  );
}
