import React, { useEffect, useState } from "react";
import envVar from "../../utils/envVar";
import { Button, Modal } from "flowbite-react";
import { IoIosArrowForward } from "react-icons/io";

export default function SelectCategory({
  openModal,
  setOpenModal,
  formData,
  setFormData,
}) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [checkSub, setCheckSub] = useState(true);
  const [IDcategory, setIDcategory] = useState(formData.category.categoryId);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`${envVar.api_url}/category?isDeleted=false`);
      const data = await res.json();
      setCategories(data.categories);
    };
    fetchCategory();
    if (formData.category.categoryId) {
      openSubcategory(formData.category.categoryId);
    }
  }, [formData.category]);

  const openSubcategory = (categoryId) => {
    const fetchSubcategory = async () => {
      const res = await fetch(
        `${envVar.api_url}/subcategory?isDeleted=false&categoryId=${categoryId}`
      );
      const data = await res.json();
      setSubcategories(data.subcategories);
    };
    fetchSubcategory();
    setCheckSub(false);
    setIDcategory(categoryId)
  };

  const setCategoryAndSubcategory = (subcategoryId) => {
    setFormData({
      ...formData,
      category: {
        categoryId: IDcategory,
        subcategoryId: subcategoryId,
      },
    });
    setOpenModal(false);
  };

  return (
    <div>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Chọn loại điểm đến</Modal.Header>
        <Modal.Body>
          <Button.Group className="flex flex-col">
            {checkSub
              ? categories.map((item, index) => (
                  <Button
                    color="light"
                    className={`border-none flex justify-between w-full ${
                      item._id === formData.category.categoryId
                        ? "bg-gray-200"
                        : ""
                    }`}
                    key={index}
                    onClick={() => openSubcategory(item._id)}
                  >
                    <span className="text-left">{item.name}</span>
                    <IoIosArrowForward className="ml-2 h-5 w-5" />
                  </Button>
                ))
              : subcategories.map((item, index) => (
                  <Button
                    color="light"
                    className={`border-none justify-start ${
                      item._id === formData.category.subcategoryId
                        ? "bg-gray-200"
                        : ""
                    }`}
                    key={index}
                    onClick={() => setCategoryAndSubcategory(item._id)}
                  >
                    {item.name}
                  </Button>
                ))}
          </Button.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Hủy
          </Button>
          {!checkSub && (
            <Button color="gray" onClick={() => setCheckSub(true)}>
              Quay lại
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
