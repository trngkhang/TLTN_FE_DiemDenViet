import { Button, Navbar, Drawer, Sidebar } from "flowbite-react";
import Brand from "./Brand";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false); // Set default to false
  const path = useLocation().pathname;

  return (
    <>
      <Navbar fluid rounded>
        <Brand />
        <div className="flex md:order-2">
          <Button>Đăng nhập</Button>
          <Navbar.Toggle onClick={() => setIsOpenDrawer(true)} />
        </div>
        <Navbar.Collapse>
          <Link to="/">
            <Navbar.Link active={path === "/"} as="div">
              Home
            </Navbar.Link>
          </Link>
          <Link to="/destination">
            <Navbar.Link active={path === "/destination"} as="div">
              Tra cứu điểm đến
            </Navbar.Link>
          </Link>
          <Link to="/generate-trip">
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
    </>
  );
}

const HeaderDrawer = ({ isOpenDrawer, setIsOpenDrawer, path }) => {
  // Destructure props
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
