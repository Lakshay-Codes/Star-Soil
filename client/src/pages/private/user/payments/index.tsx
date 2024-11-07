import { useEffect, useState } from "react";
import PageTitle from "../../../../components/page-title"
import { PaymentTypeProps } from "../../../../interfaces";
import userStore, { UserStoreProps } from "../../../../store/users-store";
import { App, message, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { format } from "indian-number-format";

function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentTypeProps[]>([]);
  const {currentUser} = userStore() as UserStoreProps;
  const [loading, setLoading] = useState(false);
  const getData = async () =>{
    try {
      if (!currentUser?._id) return;
      setLoading(true);
      const response = await axios.get(`/api/payments/get-payments-by-user/${currentUser._id}`);
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
      render : (_text: string, record: PaymentTypeProps) => (
        <span className="font-medium text-indigo-600 hover:text-indigo-800">
          {record.planet.name}
        </span>
      )
    },
    {
      title : 'Date & Time',
      dataIndex : 'createdAt',
      key : 'createdAt',
      render : (_text: string, record: PaymentTypeProps) => (
        <span className="text-gray-600">
          {dayjs(record.createdAt).format('MMMM DD, YYYY hh:mm A')}
        </span>
      )
    },
    {
      title : 'Payment Id',
      dataIndex : 'paymentId',
      key : 'paymentId',
      render: (text: string) => (
        <span className="font-mono text-sm text-gray-500">
          {text}
        </span>
      )
    },
    {
      title : 'Amount',
      dataIndex : 'amount',
      key : 'amount',
      render : (_text: string, record: PaymentTypeProps) => (
        <span className="font-semibold text-green-600">
          ₹{format(Number(record.amount.toFixed(2)))}
        </span>
      )
    },
    {
      title : 'Acres Acquired',
      dataIndex : 'amount',
      key : 'acres',
      render : (_text: string, record: PaymentTypeProps) => (
        <span className="font-medium text-gray-700">
          {format(Number((record.amount / 5000).toFixed(2)))} acres
        </span>
      )
    }
  ]
  return (
    <App>
      <div className="p-5">
        <PageTitle title="Personal payments" />
        <div className="bg-white rounded-xl shadow-md p-6 mt-5">
          <Table 
            loading={loading} 
            columns={columns} 
            rowKey="_id" 
            dataSource={payments}
            className="payments-table"
            pagination={{
              pageSize: 10,
              position: ['bottomCenter'],
              className: "pt-4"
            }}
          />
        </div>
      </div>
    </App>
  )
}

export default PaymentsPage