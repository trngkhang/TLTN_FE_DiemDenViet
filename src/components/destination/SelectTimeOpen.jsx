import { TextField } from "@mui/material";

export default function SelectTimeOpen({ formData, setFormData }) {
  return (
    <TextField
      label="Giờ hoạt động"
      variant="outlined"
      value={formData?.openingTime}
      onChange={(e) =>
        setFormData({ ...formData, openingTime: e.target.value })
      }
    />
  );
}
