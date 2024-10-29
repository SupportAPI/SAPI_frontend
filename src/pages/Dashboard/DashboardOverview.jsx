import { useState } from "react";
import ApiDevelopmentStatus from "./ApiDevelopmentStatus";
import ApiDevelopmentProgress from "./ApiDevelopmentProgress";

const DashboardOverview = () => {
    const data = [
        {
            "id": "success",
            "data": [
                { "x": "local completed", "y": 85 },
            ]
        }
    ];

    const [totalAPI, setTotalAPI] = useState(120);

    return (
        <div className="p-8 h-screen overflow-y-scroll">
            <div>
                <p className="text-2xl font-bold">API Dashboard</p>
                <hr className="border-t mt-1 mb-8 border-black" />
            </div>
            <div 
                className="grid gap-4"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                }}
            >
                <ApiDevelopmentStatus data={data} maxValue={totalAPI} title={"로컬 내 API 완성"} />
                <ApiDevelopmentStatus data={data} maxValue={totalAPI} title={"서버 내 API 완성"} />
                <ApiDevelopmentStatus data={data} maxValue={totalAPI} title={"로컬 전체 API 완성"} />
                <ApiDevelopmentStatus data={data} maxValue={totalAPI} title={"서버 전체 API 완성"} />
            </div>
            
            <div>
                <p className="text-2xl font-bold">Completed API Count Progress</p>
                <hr className="border-t mt-1 mb-5 border-black" />
            </div>

            <div 
                className="grid gap-4"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                }}
            >
                <ApiDevelopmentProgress />
            </div>
        </div>
    );
};

export default DashboardOverview;
