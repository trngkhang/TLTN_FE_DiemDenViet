// DashRegion.jsx
import React, { useState, useEffect } from "react";
import envVar from "../../utils/envVar";
import { Table } from "flowbite-react";
import DeleteConfirmModal from "../DeleteComfirmModel";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import CreateRegionModal from "./CreateRegionModal";

export default function DashRegion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);

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

  return (
    <div>
      <h1 className="text-2xl font-semibold py-4">Quản lý khu vực</h1>
      <button
        className="text-blue-500 font-semibold p-2"
        onClick={handleCreateModal}
      >
        Tạo mới
      </button>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Tên</Table.HeadCell>
            <Table.HeadCell>Mô tả</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>Tùy chọn</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
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
                    <button className="text-blue-500 font-semibold hover:underline">
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
                <Table.Cell>Chưa có dữ liệu.</Table.Cell>
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

      {/* Đảm bảo truyền đúng tên biến openModalCreate */}
      <CreateRegionModal
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate} // Cập nhật đúng trạng thái
      />
    </div>
  );
}
