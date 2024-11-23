import { Button, Modal, Select, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../../utils/envVar";

export default function SelectAddress({
  openModal,
  setOpenModal,
  formData,
  setFormData,
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State lưu chọn địa chỉ
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [street, setStreet] = useState("");

  // Gán dữ liệu từ formData vào các state khi component render lần đầu
  useEffect(() => {
    if (formData && formData.address) {
      setSelectedProvince(formData.address.provinceId || null);
      setSelectedDistrict(formData.address.districtId || null);
      setSelectedWard(formData.address.wardId || null);
      setStreet(formData.address.street || "");
    }
  }, [formData]);

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

  // Lấy danh sách quận/huyện dựa trên tỉnh/thành đã chọn
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return;
      const res = await fetch(
        `${envVar.api_url}/district?isDeleted=false&provinceId=${selectedProvince}`
      );
      const data = await res.json();
      if (res.ok) {
        setDistricts(data.districts);
        setWards([]); // Xóa danh sách phường/xã cũ khi tỉnh/thành thay đổi
        setSelectedWard(null); // Reset selectedWard khi tỉnh/thành thay đổi
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return;
      const res = await fetch(
        `${envVar.api_url}/ward?isDeleted=false&districtId=${selectedDistrict}`
      );
      const data = await res.json();
      if (res.ok) {
        setWards(data.wards);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // Đảm bảo đồng bộ selectedDistrict và selectedWard khi render lần đầu
  useEffect(() => {
    if (selectedProvince && districts.length > 0) {
      setSelectedDistrict(formData.address.districtId || null);
    }
  }, [districts, selectedProvince]);

  useEffect(() => {
    if (selectedDistrict && wards.length > 0) {
      setSelectedWard(formData.address.wardId || null);
    }
  }, [wards, selectedDistrict]);

  // Xử lý khi nhấn nút Xác nhận
  const handleConfirm = () => {
    setFormData({
      ...formData,
      address: {
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        wardId: selectedWard,
        street,
      },
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

          {/* Chọn Phường/Xã */}
          <Label htmlFor="ward">Phường/Xã</Label>
          <Select
            id="ward"
            value={selectedWard || ""}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedDistrict} // Disable khi chưa chọn Quận/Huyện
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward._id} value={ward._id}>
                {ward.name}
              </option>
            ))}
          </Select>

          {/* Nhập Số nhà và Tên đường */}
          <Label htmlFor="street">Số nhà và Tên đường</Label>
          <TextInput
            id="street"
            type="text"
            placeholder="Nhập số nhà và tên đường"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
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
