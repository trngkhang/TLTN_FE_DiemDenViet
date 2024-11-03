import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function OpeningTime({ openModal, setOpenModal }) {
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
    daysOfWeek.map((day) => ({
      day,
      open: false,
      startTime: "",
      endTime: "",
    }))
  );
  console.log(openingHours);
  const handleToggleDay = (index) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index].open = !newOpeningHours[index].open;
    setOpeningHours(newOpeningHours);
  };

  const handleTimeChange = (index, field, value) => {
    const newOpeningHours = [...openingHours];
    newOpeningHours[index][field] = value;
    setOpeningHours(newOpeningHours);
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Giờ hoạt động</Modal.Header>
      <Modal.Body>
        <div>
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
