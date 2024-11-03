import { Autocomplete, TextField } from "@mui/material";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import envVar from "../utils/envVar";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import OpeningTime from "../components/OpeningTime";
import { HiOutlineArrowRight } from "react-icons/hi";

export default function CreateDestination() {
  const [formData, setFormData] = useState({
    name: "",
    introduce: "",
    address: "",
    destinationTypeId: "",
  });
  const [destinationTypeOptions, setDestinationTypeOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [openingModal, setOpeningModal] = useState(false);

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

  useEffect(() => {
    const fetchDestinationTypes = async () => {
      const res = await fetch(
        `${envVar.api_url}/destination-type?isDeleted=false`
      );
      const data = await res.json();
      const destinationTypeOptions = data.destinationTypes.map((item) => ({
        label: item.name,
        id: item._id,
      }));
      setDestinationTypeOptions(destinationTypeOptions);
    };
    fetchDestinationTypes();
    const fetchRegionOptions = async () => {
      const res = await fetch(`${envVar.api_url}/regions?isDeleted=false`);
      const data = await res.json();
      const regionOptions = data.regions.map((item) => ({
        label: item.name,
        id: item._id,
      }));
      setRegionOptions(regionOptions);
    };
    fetchRegionOptions();
  }, []);
  console.log(formData);

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className=" text-4xl font-semibold text-center pt-2 pb-8">
        TẠO MỚI ĐIỂM ĐẾN
      </h1>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <TextField id="name" label="Tên điểm đến" variant="outlined" />
          <div className="w-full flex gap-3">
            <TextField
              id="openingTime"
              label="Thời gian mở cửa"
              variant="outlined"
            />
            <TextField id="ticketPrice" label="Giá vé" variant="outlined" />
          </div>
          <OpeningTime
            openModal={openingModal}
            setOpenModal={setOpeningModal}
          />
          <Button color="light" onClick={() => setOpeningModal(true)} >
            Chọn giờ hoạt động
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <TextField id="introduce" label="Giới thiệu" variant="outlined" />
          <TextField id="address" label="Địa chỉ" variant="outlined" />
          
          <Autocomplete
            id="destinationTypeId"
            size="small"
            disablePortal
            options={destinationTypeOptions}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Tỉnh thành" />
            )}
            onChange={(event, value) => {
              if (value) {
                setFormData({
                  ...formData,
                  destinationTypeIdionId: value.label,
                });
              }
            }}
          />
          <Autocomplete
            id="regionId"
            size="small"
            disablePortal
            options={regionOptions}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Loại điểm đến" />
            )}
            onChange={(event, value) => {
              if (value) {
                setFormData({
                  ...formData,
                  destinationTypeIdionId: value.label,
                });
              }
            }}
          />
        </div>
        <div className="flex flex-row justify-between border-2 border-teal-500 border-dotted p-2">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          required
          modules={{ toolbar: toolbarOptions }}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <Button type="=submit" gradientDuoTone="greenToBlue">
          Tạo mới điểm đến
        </Button>
      </form>
    </div>
  );
}
