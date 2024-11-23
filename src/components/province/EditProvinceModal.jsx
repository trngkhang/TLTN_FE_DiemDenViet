import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../utils/envVar";
import NotificationModal from "../common/NotificationModal";
import { Autocomplete, TextField } from "@mui/material";

export default function EditProvinceModal({ openModal, setOpenModal, item }) {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    regionId: item.regionId._id,
    isDeleted: item.isDeleted,
  });
  const [notification, setNotification] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);

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
      const res = await fetch(`${envVar.api_url}/provinces/${item._id}`, {
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
        setNotification(`Chỉnh sửa tỉnh thành ${data?.name} thành công.`);
      } else {
        setCreateSuccess(false);
        setNotification(`Chỉnh sửa tỉnh thành thất bại.\n${data?.message}`);
      }
    } catch (error) {
      setCreateSuccess(false);
      setNotification(`Chỉnh sửa tỉnh thành thất bại.\n${error.message}`);
    }
  };

  useEffect(() => {
    const fetchRegions = async () => {
      const res = await fetch(`${envVar.api_url}/regions`);
      const data = await res.json();
      const arrRegions = data.regions.map((region) => ({
        label: region.name,
        id: region._id,
        isDeleted: region.isDeleted,
      }));
      setRegionOptions(arrRegions);
    };
    fetchRegions();
  }, []);
  console.log(regionOptions);
  console.log(formData);
  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tạo tỉnh thành mới
            </h3>
            <div>
              <Label htmlFor="name" value="Tên tỉnh thành" />
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
              <Label htmlFor="description" value="Mô tả" />
              <Textarea
                id="description"
                type="text"
                placeholder="Nhập Mô tả"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="regionId" value="Khu vực" />
              <Autocomplete
                id="regionId"
                size="small"
                disablePortal
                value={
                  regionOptions.find(
                    (region) => region.id === item.regionId._id
                  )?.label || null
                }
                options={regionOptions}
                sx={{ width: 300 }}
                getOptionDisabled={(option) => option.isDeleted} // Không cho phép chọn nếu `isDeleted` là true
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={{
                      color: option.isDeleted ? "grey" : "inherit", // Đặt màu xám nếu `isDeleted` là true
                      pointerEvents: option.isDeleted ? "none" : "auto", // Vô hiệu hóa tương tác nếu `isDeleted` là true
                    }}
                  >
                    {option.label} {option.isDeleted ? "(Không thể chọn)" : ""}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} />}
                onChange={(event, value) => {
                  if (value) {
                    setFormData({ ...formData, regionId: value.id });
                  }
                }}
              />
            </div>
            <div>
              <div>
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
