import SelectAddress2 from "../../components/trip/create-trip/SelectAddress2";
import { SelectBudgetOptions, SelectTravelesList } from "../../utils/contant";
import { useState } from "react";
import { Button, Textarea, TextInput } from "flowbite-react";
import NotificationModal from "../../components/common/NotificationModal";
import { useSelector } from "react-redux";
import { LoadingModal } from "../../components/common/LoadingModal";
import TripService from "../../services/TripService";

export default function CreateTrip() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState("");
  const [notificationLoading, setNotificationLoading] = useState("");

  const [navigateURL, setNavigateURL] = useState(null);
  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^[1-5]?$/.test(newValue)) {
      setFormData({ ...formData, noOfDay: newValue });
    }
  };
  const GenerateTrip = async (type) => {
    setNotification("");
    let res; // Khai báo biến res bên ngoài
    try {
      if (
        !formData ||
        !formData?.location ||
        !formData?.noOfDay ||
        !formData?.traveler ||
        !formData?.budget
      ) {
        setNotification("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      setNotificationLoading(
        "Đang tạo chuyến đi. Vui loàng đợi trong giây lát."
      );
      if (type === "byai") {
        res = await TripService.postbyai({
          location: formData.location,
          noOfDay: formData.noOfDay,
          traveler: formData.traveler,
          budget: formData.budget,
          ...(formData?.interest && { interest: formData?.interest }),
          userId: user._id,
        });
      } else {
        res = await TripService.postfromdb({
          location: formData.location,
          noOfDay: formData.noOfDay,
          traveler: formData.traveler,
          budget: formData.budget,
          provinceId: formData.provinceId,
          ...(formData?.districtId && { districtId: formData?.districtId }),
          ...(formData?.interest && { interest: formData?.interest }),
          userId: user._id,
        });
      }
      setNotificationLoading("");
      if (res.status) {
        setNavigateURL(`/trip/${res.data._id}`);
        setNotification(`Tạo thành công chuyến đi`);
      } else {
        setNotification(`Tạo chuyến đi thất bại`);
      }
    } catch (error) {
      setNotificationLoading("");
      setNotification(error.message);
    }
  };

  return (
    <div className="p-3 my-10 max-w-3xl mx-auto">
      <h1></h1>
      <div className="w-full">
        <h2 className="text-3xl font-bold">
          Hãy cho chúng tôi biết sở thích du lịch của bạn 🏕️🌴
        </h2>
        <p className="mt-3 text-gray-500 text-xl">
          Chỉ cần cung cấp một số thông tin cơ bản và công cụ lập kế hoạch
          chuyến đi của chúng tôi sẽ tạo hành trình tùy chỉnh dựa trên sở thích
          của bạn.
        </p>
      </div>
      <div className="mt-16 grid gap-2">
        <div>
          <h2 className="text-xl my-3 font-medium">Bạn dự định đi đến đâu?</h2>
          <SelectAddress2 data={formData} setData={setFormData} />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Bạn dự định đi du lịch bao nhiêu ngày?
          </h2>
          <TextInput
            placeholder="Ví dụ: 3"
            type="number"
            require="true"
            value={formData.noOfDay || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Bạn dự định sẽ đi du lịch cùng ai trong chuyến phiêu lưu tiếp theo?
          </h2>
          <div className=" grid grid-cols-4 gap-5 mt-5">
            {SelectTravelesList.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-xl ${
                  formData?.traveler === item.title &&
                  "border border-black bg-gray-100"
                }`}
                onClick={() => {
                  handleInputChange("traveler", item.title);
                }}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold">{item.title}</h2>
                <h2>{item.description}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Ngân sách của bạn là bao nhiêu?
          </h2>
          <div className=" grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-xl ${
                  formData?.budget === item.title &&
                  "border border-black bg-gray-100"
                }`}
                onClick={() => {
                  handleInputChange("budget", item.title);
                }}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold">{item.title}</h2>
                <h2>{item.description}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Sở thích du lịch của bạn là gì?
          </h2>
          <Textarea
            maxLength={"100"}
            onChange={(e) =>
              setFormData({ ...formData, interest: e.target.value })
            }
          />
        </div>
      </div>
      <div className="py-10 flex justify-center gap-3">
        <Button onClick={() => GenerateTrip("fromdb")} className="w-full">
          Gợi ý tiêu chuẩn
        </Button>
        <Button onClick={() => GenerateTrip("byai")} className="w-full">
          Gợi ý mở rộng
        </Button>
      </div>
      {notification && (
        <NotificationModal
          notification={notification}
          navigateTo={navigateURL}
        />
      )}
      {notificationLoading && (
        <LoadingModal notificationLoading={notificationLoading} />
      )}
    </div>
  );
}
