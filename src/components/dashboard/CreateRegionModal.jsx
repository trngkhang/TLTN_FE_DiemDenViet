import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import envVar from "../../utils/envVar";
import NotificationModal from "../NotificationModal";

export default function CreateRegionModal({
  openModalCreate,
  setOpenModalCreate,
}) {
  const [formData, setformData] = useState({
    name: "",
    description: "",
  });
  const [notification, setNotification] = useState(null); // State cho thông báo
  const [createSucess, setCreateSuccess] = useState(false);

  function onCloseModal() {
    setOpenModalCreate(false);
  }
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleCreate = async () => {
    try {
      setNotification(null);
      setCreateSuccess(false);
      const res = await fetch(`${envVar.api_url}/regions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCreateSuccess(true);

        setNotification(`Tạo mới khu vực ${data?.name} thành công.`);
      } else {
        setCreateSuccess(false);

        setNotification(`Tạo mới khu vực thất bại.\n${data.message}`);
      }
    } catch (error) {
      setCreateSuccess(false);
      setNotification(`Tạo mới khu vực thất bại.\n${error.message}`);
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
    window.location.reload();
  };

  return (
    <>
      <Modal show={openModalCreate} size="md" onClose={onCloseModal} popup>
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
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button onClick={handleCreate}>Tạo mới</Button>
        </Modal.Footer>
      </Modal>

      {notification && (
        <NotificationModal
          notification={notification}
          reloadPage={createSucess}
        />
      )}
    </>
  );
}
