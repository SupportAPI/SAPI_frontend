import { useState } from "react";
import ApiDevelopmentProgress from "./ApiDevelopmentProgress";

const DashboardDaily = () => {

    const data = [
        {
            "id": "success",
            "data": [
                { "x": "local completed", "y": 85 },
            ]
        }
    ];

    const [ totalAPI, setTotalAPI ] = useState(120);


    return(
        <div className="p-8 ">
            <div>
                <p className="text-2xl font-bold">Completed API Count Progress</p>
                <hr className="border-t mt-1 mb-5 border-black"/>
            </div>
            <div 
                className="grid gap-4"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                }}
            >
                <ApiDevelopmentProgress />
            </div>
        </div>
    );

};

export default DashboardDaily;