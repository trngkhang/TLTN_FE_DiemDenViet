import { Button, Clipboard } from "flowbite-react";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import envVar from "../../../utils/envVar";
import DeleteConfirmModal from "../../common/DeleteComfirmModel";
import { useNavigate } from "react-router-dom";

export default function ViewTripAction({ itemId }) {
  const navigate = useNavigate();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const handleDelete = async (itemId) => {
    try {
      const res = await fetch(`${envVar.api_url}/trip/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/trip/mytrip");
      }
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  return (
    <div className="mt-7 flex justify-between">
      <Button className="bg-red-500" onClick={() => setOpenModalDelete(true)}>
        <RiDeleteBin6Line className="mr-2 h-5 w-5" />
        Xóa
      </Button>
      <Clipboard
        valueToCopy={window.location.href}
        label="Sao chép liên kết"
        className="bg-teal-500 hover:bg-teal-700"
      />
      {openModalDelete && (
        <DeleteConfirmModal
          openModalDelete={openModalDelete}
          setOpenModalDelete={setOpenModalDelete}
          handleDelete={handleDelete}
          itemId={itemId}
        />
      )}
    </div>
  );
}
