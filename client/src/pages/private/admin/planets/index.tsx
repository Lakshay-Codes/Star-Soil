import Button from "antd/es/button";
import PageTitle from "../../../../components/page-title";
import { Star, Satellite, Edit2, XCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlanetTypeProps } from "../../../../interfaces";
import { message, Table, Tooltip, App } from "antd";
import { format } from "indian-number-format";
import axios from "axios";
import dayjs from "dayjs";
import PlanetPayments from "./planet-payments";

function PlanetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planets, setPlanets] = useState<PlanetTypeProps[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetTypeProps | null>(null);
  const [showPlanets, setShowPlanets] = useState(false);
  
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/planets/get-all");
      setPlanets(response.data.planets);
    } catch (error: any) {
      message.error("Unable to retrieve celestial data");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/planets/delete/${id}`);
      message.success("Celestial object successfully removed");
      getData();
    } catch (error: any) {
      message.error("Failed to remove celestial object");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Celestial Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Space Authority",
      dataIndex: "organizer",
      key: "organizer"
    },
    {
      title: "Surface Area (acres)",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (targetAmount: number) => format(targetAmount / 5000),
    },
    {
      title: "Settled Area (acres)",
      dataIndex: "collectedAmount",
      key: "collectedAmount",
      render: (collectedAmount: number) => format(collectedAmount / 5000),
    },
    {
      title: "Classification",
      dataIndex: "category",
      key: "category"
    },
    {
      title: "Availability",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-500" : "text-orange-500"}>
          {isActive ? "Open" : "Reserved"}
        </span>
      ),
    },
    {
      title: "Discovery Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        dayjs(createdAt).format("DD/MM/YY"),
    },
    {
      title: "Operations",
      key: "actions",
      render: (_text: string, record: PlanetTypeProps) => (
        <div className="flex gap-3">
          <Tooltip title="View Settlement Details">
            <Button
              type="text"
              onClick={() => {
                setSelectedPlanet(record);
                setShowPlanets(true);
              }}
              icon={<Star size={16} />}
            />
          </Tooltip>
          <Tooltip title="Remove Celestial Body">
            <Button
              type="text"
              onClick={() => onDelete(record._id)}
              loading={loading}
              icon={<XCircle size={16} />}
            />
          </Tooltip>
          <Tooltip title="Modify Details">
            <Button
              type="text"
              onClick={() => navigate(`/admin/planets/edit/${record._id}`)}
              icon={<Edit2 size={16} />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <App>
      <div className="p-5">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Planets Management" />
          <Tooltip title="Register New Body">
            <Button
              icon={<Satellite size={16} />}
              type="primary"
              onClick={() => navigate("/admin/planets/create")}
            >
              Register
            </Button>
          </Tooltip>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={planets}
            loading={loading}
            pagination={{
              pageSize: 12,
              showTotal: (total) => `${total} celestial bodies found`
            }}
          />
        </div>

        {showPlanets && (
          <PlanetPayments
            open={showPlanets}
            setOpen={setShowPlanets}
            selectedPlanet={selectedPlanet as PlanetTypeProps}
          />
        )}
      </div>
    </App>
  );
}

export default PlanetPage;
