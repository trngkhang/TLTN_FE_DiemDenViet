import { useState } from "react";
import { app } from "../../../utils/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Alert, Button, FileInput } from "flowbite-react";

export default function UploadImage({ formData, setFormData }) {
  const [file, setFile] = useState(null);
  const [imageFleUploadError, setImageFleUploadError] = useState(null);
  const [imageFleUploadProgress, setImageFleUploadEProgress] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFleUploadError("Please select an image");
        return;
      }
      setImageFleUploadEProgress(null);
      setImageFleUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.fileName;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFleUploadEProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFleUploadError("Upload Image Failed");
          setImageFleUploadEProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setFormData({ ...formData, image: downloadUrl });
            setImageFleUploadEProgress(null);
            setImageFleUploadError(null);
          });
        }
      );
    } catch (error) {
      setImageFleUploadError(error.message);
    }
  };
  return (
    <>
      <div className="flex flex-row justify-between border-2 border-teal-500 border-dotted p-2">
        <FileInput
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button
          type="button"
          gradientDuoTone="purpleToBlue"
          size="sm"
          outline
          onClick={handleUploadImage}
          disabled={imageFleUploadProgress}
        >
          {imageFleUploadProgress ? (
            <CircularProgressbar
              value={imageFleUploadProgress}
              text={`${imageFleUploadProgress || 0}%`}
              className="w-16 h-16"
            />
          ) : (
            "Upload image"
          )}
        </Button>
      </div>
      {imageFleUploadError && (
        <Alert color="failure">{imageFleUploadError}</Alert>
      )}
      {formData.image && (
        <img
          src={formData.image}
          alt="uploadImg"
          className="w-full h-60 object-cover"
        />
      )}
    </>
  );
}
