import { Button, Label, Modal, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import envVar from "../../utils/envVar";

export default function SelectCategory({
  openModal,
  setOpenModal,
  filter,
  setFilter,
}) {
  const [categories, setcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    setSelectedCategory(filter?.categoryId || "");
    setSelectedSubcategory(filter?.subcategoryId || "");
  }, [filter]);

  useEffect(() => {
    const fetchcategories = async () => {
      const res = await fetch(`${envVar.api_url}/category?isDeleted=false`);
      const data = await res.json();
      if (res.ok) {
        setcategories(data.categories);
      }
    };
    fetchcategories();
  }, []);
  useEffect(() => {
    const fetchsubcategories = async () => {
      if (!selectedCategory) return;
      const res = await fetch(
        `${envVar.api_url}/subcategory?isDeleted=false&categoryId=${selectedCategory}`
      );
      const data = await res.json();
      if (res.ok) {
        setSubcategories(data.subcategories);
      }
    };
    fetchsubcategories();
  }, [selectedCategory]);

  // Xử lý khi nhấn nút Xác nhận
  const handleConfirm = () => {
    setFilter({
      ...filter,
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategory,
    });
    setOpenModal(false); // Đóng modal sau khi xác nhận
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Chọn lạo điểm đến</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <Label htmlFor="category">Loại điểm đến</Label>
          <Select
            id="category"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Chọn loại điểm đến</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>

          {/* Chọn Quận/Huyện */}
          <Label htmlFor="subcategory">Loại điểm đến cụ thể</Label>
          <Select
            id="subcategory"
            value={selectedSubcategory || ""}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory} // Disable khi chưa chọn Tỉnh/Thành phố
          >
            <option value="">Chọn điểm đến cụ thể</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
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
