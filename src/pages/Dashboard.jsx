import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardComp from "../components/dashboard/DashboardComp";
import DashRegion from "../components/dashboard/region/DashRegion";
import DashSidebar from "../components/dashboard/DashSidebar";
import { IoClose } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import DashProvince from "../components/dashboard/DashProvince";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Tạo một hiệu ứng lắng nghe sự thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Đóng sidebar off-canvas nếu màn hình lớn hơn md
      }
    };

    window.addEventListener("resize", handleResize);

    // Kiểm tra ngay khi component được render lần đầu tiên
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Nút để mở sidebar khi màn hình nhỏ */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <HiOutlineMenuAlt2 className="text-3xl text-gray-900" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0 z-50" : "md:z-0 -translate-x-full"
        } fixed inset-y-0 left-0 w-[60%] max-w-xs  transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 bg-gray-50`}
      >
        {isSidebarOpen && (
          <button className=" w-full md:hidden" onClick={toggleSidebar}>
            <IoClose className="ml-auto mr-4 mt-4 text-3xl" />
          </button>
        )}
        <DashSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 md:p-2">
        {(tab === "dash" || tab === "") && <DashboardComp />}
        {tab === "region" && <DashRegion />}
        {tab === "province" && <DashProvince />}
      </div>
    </div>
  );
}
