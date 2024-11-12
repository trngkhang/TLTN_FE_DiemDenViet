import { TextField } from "@mui/material";
import { Alert, Button } from "flowbite-react";
import { useEffect, useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import OpeningTime from "../components/create-destination/OpeningTime";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import SelectCategory from "../components/create-destination/SelectCategory";
import UploadImage from "../components/create-destination/UploadImage";
import SelectAddress from "../components/create-destination/SelectAddress";
import envVar from "../utils/envVar";
import { useNavigate, useParams } from "react-router-dom";
import NotificationModal from "../components/NotificationModal";
import { app } from "../utils/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function UpdateDestination() {
  const navigate = useNavigate();
  const quillRef = useRef(null); // Quill reference to access the editor
  const { destinationId } = useParams();

  // Initialize form data state
  const [formData, setFormData] = useState({
    name: "",
    introduce: "",
    address: {},
    category: {},
    image: "",
    openingTime: [],
    description: "",
    ticketPrice: "",
  });

  const [openingModal, setOpeningModal] = useState(false);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [navigateURL, setNavigateURL] = useState(null);
  // Hàm upload ảnh lên Firebase Storage
  const handleUploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject("No file selected");
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  // Xử lý chèn ảnh vào ReactQuill
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files[0];
      try {
        const imageUrl = await handleUploadImage(file);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
    input.click();
  };

  const toolbarOptions = [
    [
      { header: [1, 2, 3, 4, 5, 6, false] },
      { size: ["small", false, "large", "huge"] },
    ],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
    ["link", "video"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  // Fetch data only if destinationId changes
  const fetchDestination = useCallback(async () => {
    try {
      const res = await fetch(
        `${envVar.api_url}/destination/${destinationId}/update`
      );
      const data = await res.json();
      if (res.ok) {
        setPublishError(null);
        // Update formData with fetched data
        setFormData((prevData) => ({
          ...prevData,
          name: data.name || "",
          introduce: data.introduce || "",
          address: data.address || {},
          category: {
            categoryId: data.category.categoryId || "",
            subcategoryId: data.category.subcategoryId || "",
          },
          image: data.image || "",
          openingTime: data.openingTime || [],
          description: data.description || "",
          ticketPrice: data.ticketPrice || "",
        }));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  // Avoid direct mutation by defining specific update functions for each field
  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${envVar.api_url}/destination/${destinationId}`,
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
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setNavigateURL(`/destination/${data.newDestination._id}`);
        setNotification(`Tạo thành công điểm đến ${data.newDestination.name}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  console.log(formData);
  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className=" text-4xl font-semibold text-center pt-2 pb-8">
        CHỈNH SỬA ĐIỂM ĐẾN
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextField
            id="name"
            label="Tên điểm đến"
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleFormDataChange("name", e.target.value)}
          />
          <TextField
            id="introduce"
            label="Giới thiệu"
            variant="outlined"
            value={formData.introduce}
            onChange={(e) => handleFormDataChange("introduce", e.target.value)}
          />
          <div className="w-full grid grid-cols-2 gap-3">
            <TextField
              id="ticketPrice"
              label="Giá vé"
              variant="outlined"
              value={formData.ticketPrice}
              onChange={(e) =>
                handleFormDataChange("ticketPrice", e.target.value)
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
            {formData.subcategoryId
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
          ref={quillRef}
          modules={modules}
          value={formData.description}
          onChange={(value) => handleFormDataChange("description", value)}
        />
        {/* Nút tải ảnh ngoài Quill toolbar */}
        <Button onClick={handleImageUpload} color="light">
          Chèn ảnh
        </Button>

        {publishError && <Alert color="failure">{publishError}</Alert>}
        <Button type="submit" gradientDuoTone="greenToBlue">
          Cập nhật
        </Button>
      </form>

      {/* Modals */}
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
