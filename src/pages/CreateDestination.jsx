import { TextField } from "@mui/material";
import { Alert, Button } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import OpeningTime from "../components/create-destination/OpeningTime";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import SelectCategory from "../components/create-destination/SelectCategory";
import UploadImage from "../components/create-destination/UploadImage";
import SelectAddress from "../components/create-destination/SelectAddress";
import envVar from "../utils/envVar";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../components/NotificationModal";

export default function CreateDestination() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    introduce: "",
    address: {},
    subcategoryId: "",
    subcategoryName: "",
    image: "",
    openingTime: [],
    description: "",
  });
  const [openingModal, setOpeningModal] = useState(false);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [publishErorr, setPublishErorr] = useState(null);
  const [notification, setNotification] = useState(null);
  const [navigateURL, setNavigateURL] = useState(null);

  const toolbarOptions = [
    [
      { header: [1, 2, 3, 4, 5, 6, false] },
      { size: ["small", false, "large", "huge"] },
    ],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"], // remove formatting button
  ];
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${envVar.api_url}/destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishErorr(data.message);
        return;
      }
      if (res.ok) {
        setPublishErorr(null);
        navigate(`/destination/${data._id}`);
        setNavigateURL(`/destination/${data._id}`);
        setNotification(`Tạo thành công điểm đến ${data.name}`);
      }
    } catch (error) {
      setPublishErorr(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className=" text-4xl font-semibold text-center pt-2 pb-8">
        TẠO MỚI ĐIỂM ĐẾN
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextField
            id="name"
            label="Tên điểm đến"
            variant="outlined"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            id="introduce"
            label="Giới thiệu"
            variant="outlined"
            onChange={(e) =>
              setFormData({ ...formData, introduce: e.target.value })
            }
          />
          <div className="w-full grid grid-cols-2 gap-3">
            <TextField
              id="ticketPrice"
              label="Giá vé"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />
            <Button color="light" onClick={() => setOpeningModal(true)}>
              Chọn giờ hoạt động
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <Button color="light" onClick={() => setOpenModalAddress(true)}>
            Chọn địa chỉ
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            outline
            color="light"
            className="hover:border-black rounded-sm"
            onClick={() => setOpenModalCategory(true)}
          >
            {formData?.subcategoryId
              ? formData.subcategoryName
              : "Loại điểm đến"}

            <IoIosArrowForward className="mr-2 h-5 w-5" />
          </Button>
        </div>
        <UploadImage formData={formData} setFormData={setFormData} />
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          required
          modules={{ toolbar: toolbarOptions }}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        {publishErorr && <Alert color="failure">{publishErorr}</Alert>}
        <Button type="=submit" gradientDuoTone="greenToBlue">
          Tạo mới điểm đến
        </Button>
      </form>

      <OpeningTime
        openModal={openingModal}
        setOpenModal={setOpeningModal}
        formData={formData}
        setFormData={setFormData}
      />
      <SelectCategory
        openModal={openModalCategory}
        setOpenModal={setOpenModalCategory}
        formData={formData}
        setFormData={setFormData}
      />
      <SelectAddress
        openModal={openModalAddress}
        setOpenModal={setOpenModalAddress}
        formData={formData}
        setFormData={setFormData}
      />
      {notification && (
        <NotificationModal
          notification={notification}
          navigateTo={navigateURL}
        />
      )}
    </div>
  );
}
