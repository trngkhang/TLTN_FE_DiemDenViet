import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import envVar from "../../../utils/envVar";
import NotificationModal from "../../NotificationModal";

export default function EditRegionModal({ openModal, setOpenModal, item }) {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    isDeleted: item.isDeleted,
  });
  const [notification, setNotification] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  function onCloseModal() {
    setOpenModal(false);
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const value = e.target.value === "Khóa"; // Assume "Khóa" means true and "Không khóa" means false
    setFormData((prev) => ({ ...prev, isDeleted: value }));
  };

  const handleCreate = async () => {
    try {
      setNotification(null);
      setCreateSuccess(false);
      const res = await fetch(`${envVar.api_url}/regions/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCreateSuccess(true);
        setNotification(
          `Chỉnh sửa khu vực ${data?.updateRegion?.name} thành công.`
        );
      } else {
        setCreateSuccess(false);
        setNotification(`Chỉnh sửa khu vực thất bại.\n${data?.message}`);
      }
    } catch (error) {
      setCreateSuccess(false);
      setNotification(`Chỉnh sửa khu vực thất bại.\n${error.message}`);
    }
  };

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tạo khu vực mới
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Tên khu vực" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Nhập tên khu vực"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Mô tả" />
              </div>
              <TextInput
                id="description"
                type="text"
                placeholder="Nhập Mô tả"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="isDeleted" value="Khóa truy cập" />
              </div>
              <select
                id="isDeleted"
                value={formData.isDeleted ? "Khóa" : "Không khóa"}
                onChange={handleSelectChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="Khóa">Khóa</option>
                <option value="Không khóa">Không khóa</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button onClick={handleCreate}>Cập nhật</Button>
        </Modal.Footer>
      </Modal>

      {notification && (
        <NotificationModal
          notification={notification}
          reloadPage={createSuccess}
        />
      )}
    </>
  );
}
