import adminService from "../../api/admin";
import { useQueries } from "react-query";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale, // Register the Category scale for X-axis
    LinearScale, // Linear scale for Y-axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { useCompactNumber } from "../../hooks";

// Register the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GoogleAnalyticsDashboard = () => {
    const compactNumber = useCompactNumber();
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Loading...",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                fill: false,
            },
        ],
    });
    const [
        { data: cityWiseAnalytics, isLoading: cityWiseAnalyticsLoading },
        { data: graphAnalytics, isLoading: graphAnalyticsLoading },
    ] = useQueries([
        {
            queryKey: "cityWiseAnalytics",
            queryFn: async () =>
                await adminService.getGoogleCityWiseAnalytics("30daysAgo"),
        },
        {
            queryKey: "graphAnalytics",
            queryFn: async () =>
                await adminService.getGoogleGraphAnalytics("30daysAgo"),
        },
    ]);

    useEffect(() => {
        if (!graphAnalyticsLoading && !cityWiseAnalyticsLoading) {
            const formattedData = graphAnalytics.map((item) => {
                const rawDate = item.dimensionValues[0].value; // Assume this is in YYYYMMDD format

                const year = parseInt(rawDate.substring(0, 4), 10);
                const month = parseInt(rawDate.substring(4, 6), 10) - 1; // Month is 0-indexed in JS Date
                const day = parseInt(rawDate.substring(6, 8), 10);

                // Create a valid Date object
                const date = new Date(year, month, day);

                return {
                    date,
                    sessions: Number(item.metricValues[0].value),
                };
            });

            // Sort the data by date
            formattedData.sort((a, b) => a.date - b.date);

            // Extract sorted dates and sessions
            const dates = formattedData.map((item) =>
                item.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })
            );
            const sessions = formattedData.map((item) => item.sessions);

            const activeUsers = cityWiseAnalytics.map(
                (item) => item.activeUsers
            );

            setChartData({
                labels: dates,
                datasets: [
                    {
                        label: `Sessions (${compactNumber(
                            sessions.reduce((sum, current) => sum + current, 0)
                        )})`,
                        data: sessions,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                        fill: false,
                    },
                    {
                        label: `Active Users (${compactNumber(
                            activeUsers.reduce(
                                (sum, current) => sum + +current,
                                0
                            )
                        )})`,
                        data: activeUsers,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 2,
                        fill: false,
                    },
                ],
            });
        }
    }, [graphAnalyticsLoading, cityWiseAnalyticsLoading]);

    return (
        <div className="my-5 px-5 w-full flex gap-5">
            <div className="w-2/3">
                <h3 className="text-xl font-bold mb-3">Google Analytics</h3>
                {graphAnalyticsLoading && !chartData ? (
                    <div className="w-full h-[330px] flex flex-col gap-5 overflow-auto scrollbar-css pr-1 shadow-inner bg-opacity-50">
                        <Loading />
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-gray-700 to-transparent p-4 rounded-2xl shadow-sm">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Date",
                                            color: "white", // Customize x-axis label color
                                        },
                                        ticks: {
                                            color: "lightblue", // Customize x-axis text color
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: "Sessions",
                                            color: "white", // Customize y-axis label color
                                        },
                                        ticks: {
                                            color: "lightblue", // Customize y-axis text color
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: "white", // Customize legend text color
                                            usePointStyle: true,
                                            pointStyle: "circle",
                                            boxHeight: 10,
                                            font: {
                                                size: 14, // Customize legend font size
                                            },
                                        },
                                        position: "top",
                                        align: "start",
                                    },
                                    title: {
                                        display: true,
                                        text: "Analytics Over Last 30 Days",
                                        color: "white", // Customize chart title color
                                        font: {
                                            size: 16, // Customize font size for the title
                                        },
                                    },
                                    tooltip: {
                                        bodyColor: "white", // Customize tooltip text color
                                        titleColor: "lightblue", // Customize tooltip title color
                                    },
                                },
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="w-1/3">
                <h3 className="text-xl font-bold mb-3">Google Analytics</h3>
                <div className="">
                    {cityWiseAnalyticsLoading ? (
                        <div className="w-full h-[330px] flex flex-col gap-5 overflow-auto scrollbar-css pr-1 shadow-inner bg-opacity-50">
                            <Loading />
                        </div>
                    ) : (
                        <div
                            className="w-full h-[330px] flex flex-col gap-5 overflow-auto scrollbar-css pr-1 shadow-inner bg-opacity-50"
                            style={{ "--scrollbar-color": "#2b5274" }}
                        >
                            {cityWiseAnalytics.length &&
                                cityWiseAnalytics.map((data, index) => (
                                    <div
                                        key={index}
                                        className="w-full bg-opacity-50 bg-gradient-to-br from-gray-700 to-transparent py-2 px-4 rounded-2xl shadow-sm"
                                    >
                                        <div className="font-semibold">
                                            {data.city === "(not set)"
                                                ? "N/A"
                                                : data.city}
                                            , {data.country}
                                        </div>
                                        <div className="text-sm font-semibold">
                                            Active Users: {data.activeUsers}
                                        </div>
                                        <div className="flex justify-between gap-2 text-xs">
                                            <div>Sessions: {data.sessions}</div>
                                            <div>
                                                Sessions Per User:{" "}
                                                {Number(
                                                    data.sessionsPerUser
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-2 text-xs">
                                            <div>
                                                Screen Page Views:{" "}
                                                {data.screenPageViews}
                                            </div>
                                            <div>
                                                Avg Screen Page Views:{" "}
                                                {Number(
                                                    data.screenPageViewsPerSession
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleAnalyticsDashboard;
