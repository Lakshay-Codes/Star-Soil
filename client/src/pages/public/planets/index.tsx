import { useEffect, useState } from "react";
import { PlanetTypeProps } from "../../../interfaces";
import { Button, Progress, Spin, Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "indian-number-format";
import { LogIn, Rocket } from "lucide-react";

function PublicPlanetsPage() {
  const [loading, setLoading] = useState(false);
  const [planets, setPlanets] = useState<PlanetTypeProps[]>([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/planets/get-all");
      setPlanets(response.data.planets || []);
    } catch (error: any) {
      console.error("Error fetching planets:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-5 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center md:text-left bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Welcome to Star Soil
            </h1>
            <p className="text-lg text-gray-600 text-center md:text-left">
              Your gateway to owning celestial territories
            </p>
          </div>
          <Button 
            type="primary"
            size="large"
            icon={<LogIn className="w-5 h-5" />}
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 hover:scale-105 transition-transform text-lg px-6 h-12"
          >
            Login to Purchase
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="mt-4">
            <span className="bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 px-8 py-4 rounded-full font-medium inline-flex items-center gap-3 shadow-xl">
              <Rocket className="w-5 h-5" />
              Star Soil Special: ₹5,000 per acre on all planets!
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : planets.length === 0 ? (
          <div className="text-center text-gray-500 h-[400px] flex items-center justify-center">
            <p className="text-lg">No planets available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
            {planets.map((planet, index) => (
              <div
                key={planet._id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate("/login")}
              >
                <div className="relative">
                  <img
                    src={planet.images?.[0] || '/placeholder-planet.jpg'}
                    alt={planet.name}
                    className="rounded-t-xl w-full h-60 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-planet.jpg';
                    }}
                  />
                  <Tag color="default" className="absolute top-4 right-4 px-4 py-1 text-sm font-medium rounded-full">
                    {planet.category}
                  </Tag>
                </div>
                <div className="flex flex-col gap-4 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
                    {planet.name}
                  </h2>
                  <p className="text-base text-gray-600 line-clamp-2">
                    {planet.description}
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Land Claimed</span>
                      <span>{Math.min(Math.floor((planet.collectedAmount / planet.targetAmount) * 100), 100)}%</span>
                    </div>
                    <Progress
                      percent={Math.min(Math.floor((planet.collectedAmount / planet.targetAmount) * 100), 100)}
                      strokeColor={{
                        '0%': '#1e293b',
                        '100%': '#0f172a',
                      }}
                      showInfo={false}
                      className="mb-2"
                      strokeWidth={8}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span className="font-medium">
                        {format(Math.floor(planet.collectedAmount/5000))} acres claimed
                      </span>
                      <span className="text-gray-500">
                        of {format(Math.floor(planet.targetAmount/5000))} acres
                      </span>
                    </div>
                    <div className="mt-6">
                      <Button 
                        type="primary" 
                        size="large" 
                        className="w-full hover:scale-105 transition-transform h-12 text-base font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/login");
                        }}
                      >
                        Login to Purchase
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicPlanetsPage;