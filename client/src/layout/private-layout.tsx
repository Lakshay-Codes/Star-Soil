import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import { App, message, Spin } from "antd";
import axios from "axios";
import userStore, { UserStoreProps } from "../store/users-store";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const { setCurrentUser, currentUser }: UserStoreProps = userStore() as UserStoreProps;
  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
      return;
    }
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/current-user");
      setCurrentUser(response.data.user);
    } catch (error: any) {
      message.error("Failed to fetch current user");
      Cookies.remove("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (!currentUser.isAdmin && pathname.includes("/admin")) {
    message.error("You are not authorized to access this page");
    navigate("/");
    return null;
  }

  return (
    <App>
      <div>
        <Header />
        <div className="p-6">{children}</div>
      </div>
    </App>
  );
}

export default PrivateLayout;
