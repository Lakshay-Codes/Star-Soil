import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Input, Button, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import PageTitle from "../../../../components/page-title"
import userStore from "../../../../store/users-store";
import { UserStoreProps } from "../../../../store/users-store";

function ProfilePage() {
  const {currentUser} = userStore() as UserStoreProps;
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const getUserProperty = (value : string, key : string) => {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 duration-300 transition-all"> 
        <span className="text-gray-600 text-sm font-medium">{key}</span>
        <span className="text-gray-800 text-base font-semibold">{value}</span>
      </div>
    )
  }

  return (
    <App>
      <div className="p-5">
        <PageTitle title="Profile" />
        <div className="mt-7 flex gap-7">
          <div className="flex-1 p-8 bg-white border-gray-100 border rounded-2xl shadow-lg">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {getUserProperty(currentUser?.name || "", "Name")}
              {getUserProperty(currentUser?.isAdmin ? "Admin" : "User", "Role")}
              {getUserProperty(currentUser?.email || "", "Email")} 
              {getUserProperty(dayjs(currentUser?.createdAt).format("MMM DD, YYYY hh:mm A"), "Account created")}
              {getUserProperty(dayjs(currentUser?.updatedAt).format("MMM DD, YYYY hh:mm A"), "Last Active")}
              {getUserProperty(currentUser?._id || "", "UserId")}
            </div>
          </div>

          <div className="w-96 p-8 bg-white border-gray-100 border rounded-2xl shadow-lg">
            <h3 className="mb-6 text-gray-800 text-xl font-semibold">Change Password</h3>
            <div className="flex flex-col gap-5">
              <Input.Password
                className="py-2 text-base"
                value={oldPassword}
                placeholder="Old Password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Input.Password
                className="py-2 text-base"
                value={newPassword}
                placeholder="New Password" 
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div>
                <Button 
                  type="primary"
                  onClick={async () => {
                    try {
                      if (!newPassword || !oldPassword) {
                        message.error("Please fill in all fields");
                        return;
                      }
                      if (newPassword.length < 6) {
                        message.error("Password must be at least 6 characters long");
                        return;
                      }
                      if (newPassword === oldPassword) {
                        message.error("New password cannot be the same as old password");
                        return;
                      }
                      await axios.post("/api/users/update-password", {
                        userId: currentUser?._id,
                        oldPassword,
                        newPassword
                      });
                      setNewPassword("");
                      setOldPassword("");
                      message.success("Password updated successfully");
                      navigate("/");
                    } catch (error: any) {
                      message.error("Error updating password");
                    }
                  }}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </App>
  )
}

export default ProfilePage