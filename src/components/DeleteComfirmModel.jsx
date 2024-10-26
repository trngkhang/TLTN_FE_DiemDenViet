import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DeleteConfirmModal({
  openModalDelete,
  setOpenModalDelete,
  handleDelete,
  itemId,
}) {
  const confirmDelete = () => {
    handleDelete(itemId); 
    setOpenModalDelete(false);  
  };

  return (
    <Modal
      show={openModalDelete}
      size="md"
      onClose={() => setOpenModalDelete(false)}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
          <h3 className="mb-5 text-xl font-bold text-gray-500">
            Xác nhận xóa?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={confirmDelete}>
              Xóa
            </Button>
            <Button color="gray" onClick={() => setOpenModalDelete(false)}>
              Quay lại
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
