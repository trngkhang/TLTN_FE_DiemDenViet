import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../utils/envVar";
import NotificationModal from "../common/NotificationModal";
import { Autocomplete, TextField } from "@mui/material";

export default function CreateProvinceModal({ openModal, setOpenModal }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regionId: "",
  });
  const [notification, setNotification] = useState(null); // State cho thông báo
  const [createSucess, setCreateSuccess] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);

  function onCloseModal() {
    setOpenModal(false);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleCreate = async () => {
    try {
      setNotification(null);
      setCreateSuccess(false);
      const res = await fetch(`${envVar.api_url}/provinces`, {
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

        setNotification(`Tạo mới tỉnh thành ${data?.name} thành công.`);
      } else {
        setCreateSuccess(false);

        setNotification(`Tạo mới tỉnh thành thất bại.\n${data.message}`);
      }
    } catch (error) {
      setCreateSuccess(false);
      setNotification(`Tạo mới tỉnh thành thất bại.\n${error.message}`);
    }
  };
  useEffect(() => {
    const fetchRegions = async () => {
      const res = await fetch(`${envVar.api_url}/regions?isDeleted=false`);
      const data = await res.json();
      const arrRegions = data.regions.map((region) => ({
        label: region.name,
        id: region._id,
      }));
      setRegionOptions(arrRegions);
    };
    fetchRegions();
  }, []);
  console.log(formData);
  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tạo mới tỉnh thành
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Tên tỉnh thành" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Nhập tên tỉnh thành"
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
              <Autocomplete
                size="small"
                disablePortal
                options={regionOptions}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Khu vực" />
                )}
                onChange={(event, value) => {
                  if (value) {
                    setFormData({ ...formData, regionId: value.id });
                  }
                }}
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
