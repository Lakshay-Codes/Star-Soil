import { message, Modal, Table} from "antd"
import { PlanetTypeProps, PaymentTypeProps } from "../../../../interfaces"
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { format } from "indian-number-format";

function PlanetPayments({
    open,
    setOpen,
    selectedPlanet
}:{
    open: boolean,
    setOpen: (open: boolean) => void,
    selectedPlanet: PlanetTypeProps
}) { 
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
        try {
            setLoading(true);
            const response= await axios.get(`/api/payments/get-payments-by-planet/${selectedPlanet._id}`)
            setPayments(response.data.payments);
        } catch (error:any) {
            message.error("Error fetching payments");
        } finally {
            setLoading(false);
        }
  }
  useEffect(() => {
    if(selectedPlanet){
        getData();
    }
  }, [selectedPlanet]);
  const columns = [
    {
      title : 'Buyer ID',
      dataIndex : 'user',
      key : 'user',
      render : (_text: string, record: PaymentTypeProps) => record.user
    },
    {
      title : 'Purchase Date',
      dataIndex : 'createdAt',
      key : 'createdAt',
      render : (_text: string, record: PaymentTypeProps) => (
        dayjs(record.createdAt).format('MMMM DD, YYYY hh:mm A')
      )
    },
    {
      title : 'Transaction ID',
      dataIndex : 'paymentId',
      key : 'paymentId'
    },
    {
      title : 'Amount',
      dataIndex : 'amount',
      key : 'amount',
      render : (_text: string, record: PaymentTypeProps) => (
        <div>
          <div>₹{format(record.amount)}</div>
          <div className="text-xs text-gray-500">
            {(record.amount / 5000).toFixed(2)} acres
          </div>
        </div>
      )
    }
  ]
  return (
    <Modal 
      width={900} 
      footer={null} 
      open={open} 
      onCancel={() => setOpen(false)} 
      centered 
      title={`Land Purchase Records: ${selectedPlanet.name}`}
    >
        <Table 
            rowKey="_id"
            dataSource={payments}
            columns={columns as any}
            loading={loading}
            pagination={{ pageSize: 5 }}
        />
    </Modal>
  )
}

export default PlanetPayments