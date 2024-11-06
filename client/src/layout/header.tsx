import { App, Button, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserStoreProps } from "../store/users-store";
import userStore from "../store/users-store";
import { User } from "lucide-react";

function Header() {
  const { currentUser }: UserStoreProps = userStore() as UserStoreProps;
  const navigate = useNavigate();

  const onLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const userMenu: MenuProps["items"] = [
    {
      key: "0",
      label: <Link to="/">Planets</Link>,
    },
    {
      key: "1",
      label: <Link to="/user/payments">Payments</Link>,
    },
    {
      key: "2",
      label: <Link to="/user/reports">Reports</Link>,
    },
    {
      key: "3",
      label: <Link to="/user/profile">Profile</Link>,
    },
    {
      key: "4",
      label: <span onClick={onLogout} className="text-red-500">Logout</span>,
    },
  ];

  const adminMenu: MenuProps["items"] = [
    {
      key: "0",
      label: <Link to="/">Planets</Link>,
    },
    {
      key: "1",
      label: <Link to="/admin/planets">Manage Planets</Link>,
    },
    {
      key: "2",
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: "3",
      label: <Link to="/admin/payments">Payments</Link>,
    },
    {
      key: "4",
      label: <Link to="/admin/reports">Reports</Link>,
    },
    {
      key: "5",
      label: <Link to="/user/profile">Profile</Link>,
    },
    {
      key: "6",
      label: <span onClick={onLogout} className="text-red-500">Logout</span>,
    },
  ];

  const menuItems = currentUser?.isAdmin ? adminMenu : userMenu;

  return (
    <App>
      <div className="bg-[#1a1a2e] flex justify-between items-center px-8 py-4">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-bold text-white hover:text-orange-400">
            STAR SOIL
          </h1>
        </div>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button 
            icon={<User className="w-4 h-4" />}
            className="flex items-center gap-2 bg-transparent text-white border-orange-400"
          >
            {currentUser?.name}
          </Button>
        </Dropdown>
      </div>
    </App>
  );
}

export default Header;
