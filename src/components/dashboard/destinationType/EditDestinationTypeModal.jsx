import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import envVar from "../../../utils/envVar";
import NotificationModal from "../../NotificationModal";

export default function EditDestinationTypeModal({
  openModal,
  setOpenModal,
  item,
}) {
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
    const value = e.target.value === "Khóa";
    setFormData((prev) => ({ ...prev, isDeleted: value }));
  };

  const handleCreate = async () => {
    try {
      setNotification(null);
      setCreateSuccess(false);
      const res = await fetch(
        `${envVar.api_url}/destination-type/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCreateSuccess(true);
        setNotification(
          `Chỉnh sửa loại điểm đến ${data?.updatedDestinationType?.name} thành công.`
        );
      } else {
        setCreateSuccess(false);
        setNotification(`Chỉnh sửa loại điểm đến thất bại.\n${data?.message}`);
      }
    } catch (error) {
      setCreateSuccess(false);
      setNotification(`Chỉnh sửa loại điểm đến thất bại.\n${error.message}`);
    }
  };

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tạo loại điểm đến mới
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Tên loại điểm đến" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Nhập tên loại điểm đến"
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
