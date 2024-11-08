import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { FaMap, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdCategory } from "react-icons/md";

export default function DashSidebar({ setSidebarOpen }) {
  // Nhận setSidebarOpen từ props
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleLinkClick = () => {
    setSidebarOpen(false); // Đóng sidebar khi nhấp vào link
  };

  return (
    <Sidebar className="w-full h-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {user.isAdmin && (
            <Link to="/dashboard?tab=dash" onClick={handleLinkClick}>
              <Sidebar.Item active={tab === "dash"} icon={HiChartPie} as="div">
                Trang chính
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/dashboard?tab=region" onClick={handleLinkClick}>
              <Sidebar.Item active={tab === "region"} icon={FaMap} as="div">
                Khu vực
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/dashboard?tab=province" onClick={handleLinkClick}>
              <Sidebar.Item active={tab === "province"} icon={FaMap} as="div">
                Tỉnh thành
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/dashboard?tab=district" onClick={handleLinkClick}>
              <Sidebar.Item active={tab === "district"} icon={FaMap} as="div">
                Quận huyện
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/dashboard?tab=ward" onClick={handleLinkClick}>
              <Sidebar.Item active={tab === "ward"} icon={FaMap} as="div">
                Phường xã
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link
              to="/dashboard?tab=destination-type"
              onClick={handleLinkClick}
            >
              <Sidebar.Item
                active={tab === "destination-type"}
                icon={MdCategory}
                as="div"
              >
                Loại điểm đến
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/dashboard?tab=destination" onClick={handleLinkClick}>
              <Sidebar.Item
                active={tab === "destination"}
                icon={FaMapMarkerAlt}
                as="div"
              >
                Điểm đến
              </Sidebar.Item>
            </Link>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
