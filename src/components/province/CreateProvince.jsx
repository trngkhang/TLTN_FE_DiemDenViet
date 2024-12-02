import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import ProvinceService from "../../services/ProvinceService";
import NotificationModal2 from "../common/NotificationModal2";
import SelectAddress2 from "../address/SelectAddress2";

export default function CreateProvince() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [notification, setNotification] = useState(null);

  const handleCreate = async () => {
    try {
      const res = await ProvinceService.post(formData);

      if (res.status) {
        setNotification({
          message: res.message,
          reloadPage: true,
        });
      } else {
        setNotification({
          message: res.message,
          reloadPage: false,
        });
      }
    } catch (error) {
      setNotification({
        message:
          error.response?.data?.message ||
          "Đã xảy ra lỗi, vui lòng thử lại sau.",
        reloadPage: false,
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Tạo mới tỉnh thành</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Tạo mới tỉnh thành</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Tên tỉnh thành" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Nhập tên tỉnh thành"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div><SelectAddress2/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Hủy
          </Button>
          <Button onClick={handleCreate}>Tạo mới</Button>
        </Modal.Footer>
      </Modal>

      {notification && (
        <NotificationModal2
          notification={notification.message}
          reloadPage={notification.reloadPage}
        />
      )}
    </>
  );
}
