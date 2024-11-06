import { Button, Image, message, Spin } from "antd"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlanetTypeProps } from "../../../interfaces";
import axios from "axios";
import PageTitle from "../../../components/page-title";
import PaymentCard from "./payments-card";

function PlanetInfoPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [planet, setPlanet] = useState<PlanetTypeProps | null>(null);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/planets/get/${id}`);
            setPlanet(response.data.planet); 
        } catch (error:any) {
            message.error('Error fetching planet data');
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="p-5">
            <Button 
                onClick={() => navigate('/')}
                className="flex items-center mb-5 hover:text-slate-800 hover:border-slate-800"
            >
                Back To Planets
            </Button>

            {loading && (
                <div className="flex justify-center items-center h-[400px]">
                    <Spin size="large" />
                </div>
            )}

            {planet && (
                <div>
                    <PageTitle title={planet.name}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3 text-base mb-4">
                                <span className="text-slate-800 font-semibold">Category:</span>
                                <span className="text-gray-700">{planet.category}</span>
                            </div>

                            <div className="flex items-center gap-3 text-base mb-4">
                                <span className="text-slate-800 font-semibold">Space Authority:</span>
                                <span className="text-gray-700">{planet.organizer}</span>
                            </div>

                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                                {planet.description}
                            </p>

                            <PaymentCard 
                                planet={planet}
                                reloadPlanetData={getData}
                            />
                        </div>

                        <div className="space-y-8">
                            <img 
                                src={planet.images[0]} 
                                alt={planet.name} 
                                className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                            />
                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">More Views</h3>
                                <div className="flex gap-4 flex-wrap">
                                    {planet.images.map((image, index) => (
                                        <Image 
                                            src={image}
                                            alt={`${planet.name} - ${index + 1}`}
                                            key={index}
                                            className="rounded-lg object-cover"
                                            width={120}
                                            height={90}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlanetInfoPage