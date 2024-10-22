import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import envVar from "../utils/envVar";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/userSlice";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispath = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${envVar.api_url}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        dispath(login(data));
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      return setError(error.message);
    }
  };
  return (
    <div className=" justify-center">
      <h1 className="text-center text-5xl font-bold mt-5">ĐĂNG NHẬP</h1>
      <form
        className="flex max-w-md flex-col gap-4 mx-auto my-7"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Tên đăng nhập" />
          </div>
          <TextInput
            id="username"
            type="text"
            required
            shadow
            onChange={handleChange}
            value={formData.username}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Mật khẩu" />
          </div>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              required
              shadow
              onChange={handleChange}
              value={formData.password}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        {error && <Alert color="failure">{error}</Alert>}
        <Button type="submit">
          {loading ? (
            <Spinner aria-label="Default status example" />
          ) : (
            "Đăng nhập"
          )}
        </Button>
        <span className="text-right">
          Chưa có tài khoản?
          <Link to="/signup" className="text-blue-500 hover:underline ml-1">
            Đăng ký
          </Link>
        </span>
      </form>
    </div>
  );
}