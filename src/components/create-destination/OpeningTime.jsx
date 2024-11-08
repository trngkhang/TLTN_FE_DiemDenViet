import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";

export default function OpeningTime({
  openModal,
  setOpenModal,
  formData,
  setFormData,
}) {
  const daysOfWeek = [
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
    "Chủ nhật",
  ];

  const [openingHours, setOpeningHours] = useState(
    formData.openingTime.length > 0
      ? formData.openingTime
      : daysOfWeek.map((day) => ({
          day,
          open: false,
          openAllDay: false,
          closedAllDay: false,
          startTime: "",
          endTime: "",
        }))
  );

  const [selectedGroup, setSelectedGroup] = useState("all");

  // Update formData when openingHours changes
  useEffect(() => {
    if (JSON.stringify(openingHours) !== JSON.stringify(formData.openingTime)) {
      setFormData({ ...formData, openingTime: openingHours });
    }
  }, [openingHours, formData, setFormData]);

  const handleToggleDay = (index) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index].open = !newOpeningHours[index].open;
    setOpeningHours(newOpeningHours);
  };

  const handleTimeChange = (index, field, value) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index][field] = value;

    const { startTime, endTime } = newOpeningHours[index];
    if (field === "endTime" && startTime && value < startTime) {
      alert("Giờ đóng cửa phải sau giờ mở cửa");
      return;
    } else if (field === "startTime" && endTime && value > endTime) {
      alert("Giờ đóng cửa phải sau giờ mở cửa");
      return;
    }

    if (selectedGroup === "all") {
      setOpeningHours(
        newOpeningHours.map((day) => ({
          ...day,
          [field]: value,
          open: true,
          openAllDay: false,
          closedAllDay: false,
        }))
      );
    } else if (selectedGroup === "weekdays" && index < 5) {
      setOpeningHours(
        newOpeningHours.map((day, i) =>
          i < 5
            ? {
                ...day,
                [field]: value,
                open: true,
                openAllDay: false,
                closedAllDay: false,
              }
            : day
        )
      );
    } else if (selectedGroup === "weekends" && index >= 5) {
      setOpeningHours(
        newOpeningHours.map((day, i) =>
          i >= 5
            ? {
                ...day,
                [field]: value,
                open: true,
                openAllDay: false,
                closedAllDay: false,
              }
            : day
        )
      );
    } else {
      setOpeningHours(newOpeningHours);
    }
  };

  const handleApplyToAllDays = () => {
    setSelectedGroup("all");
    const newOpeningHours = openingHours.map((day) => ({
      ...day,
      open: true,
      openAllDay: false,
      closedAllDay: false,
      startTime: "08:00",
      endTime: "18:00",
    }));
    setOpeningHours(newOpeningHours);
  };

  const handleApplyToWeekdays = () => {
    setSelectedGroup("weekdays");
    const newOpeningHours = openingHours.map((day, index) => {
      if (index < 5) {
        return {
          ...day,
          open: true,
          openAllDay: false,
          closedAllDay: false,
          startTime: "08:00",
          endTime: "17:00",
        };
      }
      return day;
    });
    setOpeningHours(newOpeningHours);
  };

  const handleApplyToWeekends = () => {
    setSelectedGroup("weekends");
    const newOpeningHours = openingHours.map((day, index) => {
      if (index >= 5) {
        return {
          ...day,
          open: true,
          openAllDay: false,
          closedAllDay: false,
          startTime: "10:00",
          endTime: "16:00",
        };
      }
      return day;
    });
    setOpeningHours(newOpeningHours);
  };

  const handleToggleOpenAllDay = (index) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index].openAllDay = !newOpeningHours[index].openAllDay;
    newOpeningHours[index].closedAllDay = false;
    if (newOpeningHours[index].openAllDay) {
      newOpeningHours[index].startTime = "00:00";
      newOpeningHours[index].endTime = "23:59";
    } else {
      newOpeningHours[index].startTime = "";
      newOpeningHours[index].endTime = "";
    }
    setOpeningHours(newOpeningHours);
  };

  const handleToggleClosedAllDay = (index) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index].closedAllDay = !newOpeningHours[index].closedAllDay;
    newOpeningHours[index].openAllDay = false;
    newOpeningHours[index].open = !newOpeningHours[index].closedAllDay;
    if (newOpeningHours[index].closedAllDay) {
      newOpeningHours[index].startTime = "";
      newOpeningHours[index].endTime = "";
    }
    setOpeningHours(newOpeningHours);
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Giờ hoạt động</Modal.Header>
      <Modal.Body>
        <div>
          <div className="flex gap-2 mb-4">
            <Button onClick={handleApplyToAllDays}>
              Chỉnh sửa tất cả các ngày
            </Button>
            <Button onClick={handleApplyToWeekdays}>Chỉnh sửa T2 - T6</Button>
            <Button onClick={handleApplyToWeekends}>Chỉnh sửa T7 - CN</Button>
          </div>
          {openingHours.map((day, index) => (
            <div key={index} style={{ marginBottom: "1em" }}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={day.open}
                  onChange={() => handleToggleDay(index)}
                  className="mr-2"
                />
                {day.day}
              </label>
              {day.open && (
                <div className="ml-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={day.openAllDay}
                      onChange={() => handleToggleOpenAllDay(index)}
                      className="mr-2"
                    />
                    <span>Mở cửa cả ngày</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={day.closedAllDay}
                      onChange={() => handleToggleClosedAllDay(index)}
                      className="mr-2"
                    />
                    <span>Đóng cửa cả ngày</span>
                  </div>
                  {!day.closedAllDay && !day.openAllDay && (
                    <>
                      <label>
                        Open:
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) =>
                            handleTimeChange(index, "startTime", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        Close:
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) =>
                            handleTimeChange(index, "endTime", e.target.value)
                          }
                        />
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Hủy
        </Button>
        <Button onClick={() => setOpenModal(false)}>Đồng ý</Button>
      </Modal.Footer>
    </Modal>
  );
}
