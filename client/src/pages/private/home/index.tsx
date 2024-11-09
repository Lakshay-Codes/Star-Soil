import { useEffect, useState } from "react";
import PageTitle from "../../../components/page-title";
import { PlanetTypeProps } from "../../../interfaces";
import { message, Progress, Spin, Tag, Radio, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "indian-number-format";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [planets, setPlanets] = useState<PlanetTypeProps[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/planets/get-all");
      setPlanets(response.data.planets);
    } catch (error: any) {
      message.error("Error fetching planets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredPlanets = planets.filter((planet) => {
    let matchesFilter;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'not-for-sale') {
      matchesFilter = !planet.isActive;
    } else if (filter === 'no-land-left') {
      matchesFilter = planet.isActive && planet.collectedAmount >= planet.targetAmount;
    } else if (filter === 'sale') {
      matchesFilter = planet.isActive && planet.collectedAmount < planet.targetAmount;
    } else {
      matchesFilter = true;
    }

    const matchesSearch = planet.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-5">
      <PageTitle title="Explore Planets" />
      <div className="text-center mb-8">
        <h2 className="text-xl text-gray-600">Purchase and Own Land in the Final Frontier</h2>
        <p className="text-gray-500 mt-2">Secure your piece of space history today</p>
        <div className="mt-4">
          <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-full font-medium">Special Offer: ₹5,000 per acre on all planets!</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mb-6">
        <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="sale">Sale!</Radio.Button>
          <Radio.Button value="no-land-left">No Land Left!</Radio.Button>
          <Radio.Button value="not-for-sale">Not For Sale!</Radio.Button>
        </Radio.Group>
        <Input.Search
          placeholder="Search planets by name..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          allowClear
        />
      </div>
      {loading && (
        <div className="flex justify-center items-center h-[400px]">
          <Spin size="large" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {filteredPlanets.map((planet) => (
          <div
            key={planet._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-slate-800"
            onClick={() => navigate(`/planet/${planet._id}`)}
          >
            <div className="relative">
              <img
                src={planet.images[0]}
                alt={planet.name}
                className="rounded-t-lg w-full h-52 object-cover"
              />
              <Tag color="default" className="absolute top-3 right-3">
                {planet.category}
              </Tag>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <h1 className="text-xl font-semibold text-gray-800 line-clamp-2">
                {planet.name}
              </h1>
              <p className="text-sm text-gray-500 line-clamp-2">
                {planet.description}
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Land Claimed</span>
                  <span>{Math.min(100, Number(((planet.collectedAmount / planet.targetAmount) * 100).toFixed(2)))}%</span>
                </div>
                <Progress
                  percent={Math.min(100, Number(((planet.collectedAmount / planet.targetAmount) * 100).toFixed(2)))}
                  strokeColor="#1e293b"
                  showInfo={false}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{format(Number((Math.min(planet.collectedAmount/5000, planet.targetAmount/5000)).toFixed(2)))} acres claimed out of {format(Number((planet.targetAmount/5000).toFixed(2)))} acres</span>
                </div>  
                <div className="mt-3 text-center">
                  <span className={`font-medium ${planet.isActive && planet.collectedAmount < planet.targetAmount ? 'text-slate-800' : 'text-orange-500'}`}>
                    {planet.isActive ? 
                      (planet.collectedAmount < planet.targetAmount ? 'Sale!' : 'No Land Left!') 
                      : 'Not For Sale!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
