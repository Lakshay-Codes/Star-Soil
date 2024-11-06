import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title"
import { PaymentTypeProps } from "../../../../interfaces";
import userStore, { UserStoreProps } from "../../../../store/users-store";
import { App, message, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { format } from "indian-number-format";

function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentTypeProps[]>([]);
  const {currentUser} = userStore() as UserStoreProps;
  const [loading, setLoading] = useState(false);
  const PRICE_PER_ACRE = 5000;

  const getData = async () =>{
    try {
      if (!currentUser?._id) return;
      setLoading(true);
      const response = await axios.get(`/api/payments/get-all`);
      setPayments(response.data.payments);
    } catch (error:any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getData();
  }, [currentUser]);

  const columns = [
    {
      title : 'Planet',
      dataIndex : 'planet',
      key: 'planet',
      className: "text-sm font-medium text-blue-600",
      render : (_text: string, record: PaymentTypeProps) => record.planet?.name
    },
    {
      title : 'UserId',
      dataIndex : '_id',
      key: '_id',
      className: "text-sm",
      render : (_text: string, record: PaymentTypeProps) => record.user?._id
    },
    {
      title : 'User',
      dataIndex : 'user',
      key: 'user', 
      className: "text-sm font-medium",
      render : (_text: string, record: PaymentTypeProps) => record.user?.name
    },
    {
      title : 'Date & Time',
      dataIndex : 'createdAt',
      key : 'createdAt',
      className: "text-sm text-gray-600",
      render : (_text: string, record: PaymentTypeProps) => dayjs(record.createdAt).format('MMMM DD, YYYY hh:mm A')
    },
    {
      title : 'Payment Id',
      dataIndex : 'paymentId',
      key : 'paymentId',
      className: "text-sm text-gray-600"
    },
    {
      title : 'Amount',
      dataIndex : 'amount',
      key : 'amount',
      className: "text-sm font-medium text-green-600",
      render : (_text: string, record: PaymentTypeProps) => (
        <div>
          <div>₹{format(record.amount)}</div>
          <div className="text-xs text-gray-500">
            {(record.amount / PRICE_PER_ACRE).toFixed(2)} acres
          </div>
        </div>
      )
    }
  ]

  return (
    <App>
      <div className="p-5">
        <div className="mb-8">
          <PageTitle title="All Payments" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Table 
            loading={loading} 
            columns={columns} 
            dataSource={payments} 
            rowKey="_id"
            className="border border-gray-200 rounded-lg"
            pagination={{
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`
            }}
          />
        </div>
      </div>
    </App>
  )
}

export default AdminPaymentsPage