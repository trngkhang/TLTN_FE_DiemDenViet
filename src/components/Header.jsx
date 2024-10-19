import {
  Button,
  Navbar,
  Drawer,
  Sidebar,
  Dropdown,
  Avatar,
} from "flowbite-react";
import Brand from "./Brand";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import envVar from "../utils/envVar";
import { logout } from "../redux/slice/userSlice";

export default function Header() {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false); // Set default to false
  const [isScrolled, setIsScrolled] = useState(false);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${envVar.api_url}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        return dispatch(logout());
      }
      console.log(await res.json().message);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`px-3 shadow-md top-0 w-full fixed content-center h-16 z-50 bg-inherit ${
        isScrolled && "bg-white"
      }`}
    >
      <Navbar fluid rounded className="bg-inherit max-w-6xl mx-auto">
        <Brand />
        <div className="flex md:order-2">
          {isAuthenticated ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" img={user.avatar} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm font-semibold">{`${user.name}`}</span>
                <span className="block text-sm font-semibold">{`@${user.username}`}</span>
              </Dropdown.Header>
              <Link to="/profile">
                <Dropdown.Item>Tài khoản</Dropdown.Item>
              </Link>
              {user.isAdmin && (
                <Link to="/dashboard">
                  <Dropdown.Item>Quản lý</Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />
              <button type="button" className="w-full" onClick={handleSignOut}>
                <Dropdown.Item as="div">Đăng xuất</Dropdown.Item>
              </button>
            </Dropdown>
          ) : (
            <Link to="/signin">
              <Button>Đăng nhập</Button>
            </Link>
          )}
          <Navbar.Toggle
            onClick={() => setIsOpenDrawer(true)}
            className="text-gray-800"
          />
        </div>
        <Navbar.Collapse>
          <Link to="/" className="text-lg font-semibold">
            <Navbar.Link active={path === "/"} as="div">
              Trang chủ
            </Navbar.Link>
          </Link>
          <Link to="/destination" className="text-lg font-semibold">
            <Navbar.Link active={path === "/destination"} as="div">
              Tra cứu điểm đến
            </Navbar.Link>
          </Link>
          <Link to="/generate-trip" className="text-lg font-semibold">
            <Navbar.Link active={path === "/generate-trip"} as="div">
              AI tư vấn
            </Navbar.Link>
          </Link>
        </Navbar.Collapse>
      </Navbar>

      {/* Drawer Component */}
      <HeaderDrawer
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
        path={path}
      />
    </div>
  );
}

const HeaderDrawer = ({ isOpenDrawer, setIsOpenDrawer, path }) => {
  const handleClose = () => setIsOpenDrawer(false);

  return (
    <Drawer open={isOpenDrawer} onClose={handleClose}>
      <Drawer.Header title="Điểm Đến Việt" />
      <Drawer.Items>
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          className="[&>div]:bg-transparent [&>div]:p-0"
        >
          <div className="flex h-full flex-col justify-between py-2">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Link to="/">
                  <Sidebar.Item
                    active={path === "/"}
                    as="div"
                    onClick={handleClose}
                  >
                    Home
                  </Sidebar.Item>
                </Link>
                <Link to="/destination">
                  <Sidebar.Item
                    active={path === "/destination"}
                    as="div"
                    onClick={handleClose}
                  >
                    Tra cứu điểm đến
                  </Sidebar.Item>
                </Link>
                <Link to="/generate-trip">
                  <Sidebar.Item
                    active={path === "/generate-trip"}
                    as="div"
                    onClick={handleClose}
                  >
                    AI tư vấn
                  </Sidebar.Item>
                </Link>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </Sidebar>
      </Drawer.Items>
    </Drawer>
  );
};
