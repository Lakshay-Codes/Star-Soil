import PageTitle from "../../../../components/page-title"
import { useEffect, useState } from "react"
import { Table, message, Spin, App } from "antd"
import axios from "axios"
import dayjs from "dayjs"

function UsersList() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  const getData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/users/get-all")
      setUsers(response.data.users)
    } catch (error: any) {
      message.error("Error fetching users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const columns = [
    {
      title: "UserId",
      dataIndex: "_id",
      key: "_id",
      className: "text-sm"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "text-sm font-medium"
    },
    {
      title: "Email",
      dataIndex: "email", 
      key: "email",
      className: "text-sm"
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      className: "text-sm",
      render: (isAdmin: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
        }`}>
          {isAdmin ? "Admin" : "User"}
        </span>
      )
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-sm text-gray-600",
      render: (createdAt: string) => dayjs(createdAt).format("MMMM DD YYYY, hh:mm A")
    },
    {
      title: "Last Active", 
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "text-sm text-gray-600",
      render: (updatedAt: string) => dayjs(updatedAt).format("MMMM DD YYYY, hh:mm A")
    }
  ]

  return (
    <App>
      <div className="p-5">
        <PageTitle title="Users Management" />
        <div className="bg-white rounded-xl shadow-lg p-6 mt-5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={users} 
              rowKey="_id"
              className="border border-gray-200 rounded-lg"
              pagination={{
                pageSize: 10,
                position: ['bottomCenter'],
                className: "pt-4"
              }}
            />
          )}
        </div>
      </div>
    </App>
  )
}

export default UsersList