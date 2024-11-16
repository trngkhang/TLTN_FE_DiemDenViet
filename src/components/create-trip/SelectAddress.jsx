import { Button, Label, Modal, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../utils/envVar";

export default function SelectAddress({
  openModal,
  setOpenModal,
  data,
  setData,
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  // State lưu chọn địa chỉ
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    setSelectedProvince(data?.provinceId || "");
    setSelectedDistrict(data?.districtId || "");
  }, [data]);

  // Lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetch(`${envVar.api_url}/province?isDeleted=false`);
      const data = await res.json();
      if (res.ok) {
        setProvinces(data.provinces);
      }
    };
    fetchProvinces();
  }, []);
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return;
      const res = await fetch(
        `${envVar.api_url}/district?isDeleted=false&provinceId=${selectedProvince}`
      );
      const data = await res.json();
      if (res.ok) {
        setDistricts(data.districts);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Xử lý khi nhấn nút Xác nhận
  const handleConfirm = () => {
    // Tìm tên của tỉnh/thành và quận/huyện dựa trên ID đã chọn
    const provinceName =
      provinces.find((prov) => prov._id === selectedProvince)?.name || "";
    const districtName =
      districts.find((dist) => dist._id === selectedDistrict)?.name || "";

    setData({
      ...data,
      location: districtName
        ? `${districtName}, ${provinceName}` // Nếu có districtName
        : provinceName, // Lưu địa chỉ dạng districtName + provinceName
    });
    setOpenModal(false); // Đóng modal sau khi xác nhận
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Chọn địa chỉ</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {/* Chọn Tỉnh/Thành phố */}
          <Label htmlFor="province">Tỉnh/Thành phố</Label>
          <Select
            id="province"
            value={selectedProvince || ""}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province._id} value={province._id}>
                {province.name}
              </option>
            ))}
          </Select>

          {/* Chọn Quận/Huyện */}
          <Label htmlFor="district">Quận/Huyện</Label>
          <Select
            id="district"
            value={selectedDistrict || ""}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince} // Disable khi chưa chọn Tỉnh/Thành phố
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district._id} value={district._id}>
                {district.name}
              </option>
            ))}
          </Select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm}>Xác nhận</Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Hủy
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
