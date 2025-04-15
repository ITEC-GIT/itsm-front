import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  GetDashboardLandingData,
  GetTicketCountsByStatusAndMonth,
} from "../../config/ApiCalls";
import { toast } from "react-toastify";
import { CircularSpinner } from "../spinners/circularSpinner";
import { DonutChart } from "./donut-chart-d3";
import DonutChartClickable from "./donut-chart-d3 clickable";

interface GradientPieChartProps {
  gradientColor: string | string[];
  title?: string;
  series?: number[];
  labels?: string[];
  seriesWithData?: ApexAxisChartSeries;
}

const PieChart = ({
  gradientColor,
  title,
  series,
  labels,
}: GradientPieChartProps) => {
  const colorsArray = Array.isArray(gradientColor)
    ? gradientColor
    : [gradientColor];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      animations: { enabled: false },
      redrawOnParentResize: true,
    },
    colors: colorsArray,
    fill: {
      type: "fill",
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "65%",
          labels: {
            show: false,
          },
        },
        offsetY: 0,
        customScale: 1.0,
      },
    },
    dataLabels: {
      enabled: false,
      // style: {
      //   fontSize: "12px",
      //   fontFamily: "Arial",
      //   fontWeight: "bold",
      //   colors: ["#fff"],
      // },
      dropShadow: {
        enabled: false,
      },
      formatter: function (
        val: string,
        { seriesIndex }: { seriesIndex: number }
      ) {
        return labels ? `${labels[seriesIndex]}\n${val}%` : `${val}%`;
      },
    },
    legend: {
      show: false,
    },
    labels: labels || [],
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            pie: {
              customScale: 1.0,
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            pie: {
              customScale: 1.0,
            },
          },
        },
      },
    ],
  };

  return (
    <div
      style={{
        aspectRatio: "1/1",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "150px",
        minHeight: "200px",
      }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height="100%"
        width="100%"
      />
      {title && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "0",
            right: "0",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 500,
            color: "#666",
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
};

const BarChart = ({
  gradientColor,
  title,
  seriesWithData,
  labels,
}: GradientPieChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: "100%",
      animations: { enabled: false },
      redrawOnParentResize: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
      offsetY: 10,
    },
    title: {
      text: title,
      align: "center",
      margin: 20,
      style: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#666",
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetY: -20,
      style: {
        fontSize: "clamp(10px, 1.2vw, 12px)",
        colors: ["#56b49a"],
      },
    },
    colors: [gradientColor],
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: "clamp(10px, 1.2vw, 12px)" },
        rotate: -45,
        hideOverlappingLabels: true,
        trim: true,
      },
      tooltip: { enabled: true },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      // labels: {
      //   formatter: (val) => `${val}%`,
      //   style: { fontSize: "clamp(40px, 3.2vw, 50px)" },
      // },
      // max: 12,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { offsetY: 20 },
          plotOptions: { bar: { columnWidth: "60%" } },
          xaxis: { labels: { rotate: -45, style: { fontSize: "10px" } } },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: { offsetY: 30 },
          plotOptions: { bar: { columnWidth: "70%" } },
          xaxis: { labels: { rotate: -45, style: { fontSize: "8px" } } },
          dataLabels: { enabled: false },
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "350px" }}>
      <ReactApexChart
        options={options}
        series={seriesWithData}
        type="bar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

interface HorizontalBarChartProps {
  gradientColor: string;
  title?: string;
  labels?: string[];
  series: number[];
  xTitle?: string;
  yTitle?: string;
}

const HorizontalBarChart = ({
  gradientColor,
  title,
  series,
  labels = [],
  xTitle,
  yTitle,
}: HorizontalBarChartProps) => {
  const maxValue = Math.max(...series);
  const dynamicMax = Math.ceil(maxValue * 1.1);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "40%",
        borderRadius: 2,
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number) {
        return val.toString();
      },
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
      offsetX: 0,
    },
    xaxis: {
      categories: labels,
      title: {
        text: title,
        style: {
          fontSize: "12px",
        },
      },
      tickAmount: 4,
      min: 0,
      max: dynamicMax,
    },
    yaxis: {
      title: {
        text: yTitle,
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: [gradientColor],
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "16px",
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const label = labels[dataPointIndex];
        return `<div style="
        padding: 6px 10px;
        background-color: ${gradientColor}; 
        color: white;
        border-radius: 4px;
        font-size: 12px;
      ">
        ${label}: ${value} ${xTitle ?? ""}
      </div>`;
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ReactApexChart
        options={options}
        series={[{ data: series }]}
        type="bar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

const LineChart = ({
  colors,
  series,
  labels,
  xTitle,
  yTitle,
  title,
}: {
  colors: string[];
  series: any;
  labels: string[];
  xTitle: string;
  yTitle: string;
  title: string;
}) => {
  const allValues = series.flatMap((s: any) => s.data);
  const maxValue = Math.max(...allValues);
  const dynamicMax = Math.ceil(maxValue * 1.1);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: "100%",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true,
      parentHeightOffset: 0,
    },
    colors: colors,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "clamp(10px, 1.2vw, 12px)",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "16px",
      },
    },
    grid: {
      borderColor: "#e7e7e7",
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: labels,
      title: {
        text: xTitle,
        style: {
          fontSize: "clamp(12px, 1.3vw, 14px)",
        },
      },
      labels: {
        style: {
          fontSize: "clamp(10px, 1.1vw, 12px)",
        },
      },
    },
    yaxis: {
      logarithmic: true,
      title: {
        text: yTitle,
        style: {
          fontSize: "clamp(12px, 1.3vw, 14px)",
        },
      },
      min: 0,
      max: dynamicMax,
      // labels: {
      //   style: {
      //     fontSize: "clamp(10px, 1.1vw, 12px)",
      //   },
      // },
    },

    legend: {
      show: false,
      // position: "top",
      // horizontalAlign: "right",
      // floating: true,
      // offsetY: -25,
      // offsetX: -5,
      // fontSize: "clamp(12px, 1.3vw, 14px)",
      // markers: {
      //   strokeWidth: 2,
      // },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            dropShadow: {
              blur: 1,
            },
          },
          markers: {
            size: 3,
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 0,
            offsetX: 0,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          stroke: {
            width: 2,
          },
          markers: {
            size: 2,
          },
          grid: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
  );
};

const StatBox = ({
  bg,
  icon,
  number,
  title,
  color,
}: {
  bg: string;
  icon: string;
  number: number;
  title: string;
  color: string;
}) => {
  return (
    <div
      className="p-3 d-flex justify-content-between align-items-start hyper-card"
      style={{
        backgroundColor: bg,
        minHeight: "100px",
        height: "100%",
        borderRadius: "10px",
      }}
    >
      <div className="d-flex flex-column justify-content-center">
        <p
          className="fw-bold m-0"
          style={{
            color,
            fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
            lineHeight: "1.2",
          }}
        >
          {number.toLocaleString()}
        </p>
        <p
          className="m-0 mt-1 text-truncate"
          style={{
            color,
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            maxWidth: "100px",
          }}
        >
          {title}
        </p>
      </div>
      <div className="d-flex align-items-center">
        <i
          className={`fas ${icon}`}
          style={{
            fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            color,
            opacity: 0.8,
          }}
        ></i>
      </div>
    </div>
  );
};

const donutData = (labels: string[] = [], values: number[] = []) =>
  labels.map((label, i) => ({
    label,
    value: values[i] ?? 0,
  }));

const DashboardLanding = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [userTriggered, setUserTriggered] = useState(false);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const labels = ["Computers", "Phones", "Racks", "Monitors", "OS"];

  const handleStatusTrigger = (status: string | null) => {
    if (selectedStatus === status) return;
    setSelectedStatus(status);
    setUserTriggered(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, ticketRes] = await Promise.all([
          GetDashboardLandingData(),
          GetTicketCountsByStatusAndMonth("solved"),
        ]);

        if (res.status === 200) {
          const mergedData = {
            ...res.data,
            ticketsByStatusCount: ticketRes?.data ?? [],
          };

          setDashboardData(mergedData);
        } else {
          toast.error("Failed to load dashboard data");
          setError(`Unexpected status code: ${res.status}`);
          console.error("API Error:", res);
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred while fetching data.");
        console.error("Network Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!userTriggered) return;

    const fetchTicketStatusData = async () => {
      const statusToUse = selectedStatus ?? "solved";
      try {
        const res = await GetTicketCountsByStatusAndMonth(statusToUse);
        if (res.status === 200) {
          setDashboardData((prev: any) => ({
            ...prev,
            ticketsByStatusCount: res.data ?? [],
          }));
        } else {
          toast.error("Failed to fetch ticket status data");
          console.error("API Error:", res);
        }
      } catch (err: any) {
        toast.error(err.message || "Error fetching ticket status data");
        console.error(err);
      }
    };

    fetchTicketStatusData();
  }, [selectedStatus, userTriggered]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <CircularSpinner />
      </div>
    );
  if (error) return <div className="text-danger">Error: {error}</div>;

  const stats = [
    {
      bg: "var(--color-dark-gray)",
      color: "var(--color-light-gray)",
      icon: "fa-ticket",
      number: dashboardData.tickets.todaysTickets ?? 0,
      title: "Today's Tickets",
    },
    {
      bg: "var(--color-dark-red)",
      color: "var(--color-light-red)",
      icon: "fa-cubes",
      number: dashboardData.management.totalSoftwares ?? 0,
      title: "Software",
    },
    {
      bg: "var(--color-light-pink)",
      color: "var(--color-dark-pink)",
      icon: "fa-desktop",
      number: dashboardData?.assets?.totalComputers ?? 0,
      title: "Computers",
    },
    {
      bg: "var(--color-light-orange)",
      color: "var(--color-dark-orange)",
      icon: "fa-cogs",
      number: dashboardData?.management?.totalLicense ?? 0,
      title: "Licenses",
    },
    {
      bg: "var(--color-light-green)",
      color: "var(--color-dark-green)",
      icon: "fa-sitemap",
      number: dashboardData?.management?.totalDomains ?? 0,
      title: "Domains",
    },
    {
      bg: "var(--color-dark-blue)",
      color: "var(--color-light-blue)",
      icon: "fa-file-alt",
      number: dashboardData?.management?.totalDocuments ?? 0,
      title: "Documents",
    },
  ];
  return (
    <div className="container-fluid px-3 px-sm-4 py-3">
      <div className="row g-3">
        {stats.map((stat, index) => (
          <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-2">
            <StatBox {...stat} />
          </div>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
          <div className="card p-2" style={{ height: 250 }}>
            <span className="text-center">Warranty Distribution</span>
            <DonutChart
              data={donutData(
                dashboardData?.assets?.totalAssetsInWarrentyVsOut?.labels,
                dashboardData?.assets?.totalAssetsInWarrentyVsOut?.series
              )}
            />
            {/* <PieChart
              gradientColor={["#b2e8eb", "#0089a1"]}
              title="Warranty Distribution"
              labels={dashboardData?.assets?.totalAssetsInWarrentyVsOut?.labels}
              series={
                dashboardData?.assets?.totalAssetsInWarrentyVsOut?.series ?? [
                  0, 0,
                ]
              }
            /> */}
          </div>
          <div className="card p-2 mt-3" style={{ height: 250 }}>
            <span className="text-center">Agent installation Distribution</span>
            <DonutChart
              data={donutData(
                dashboardData?.assets?.totalComputersAgentDistribution?.labels,
                dashboardData?.assets?.totalComputersAgentDistribution?.series
              )}
            />
            {/* <PieChart
              gradientColor={["#f7d79a", "#f6922b"]}
              title="Agent installation Distribution"
              labels={
                dashboardData?.assets?.totalComputersAgentDistribution?.labels
              }
              series={
                dashboardData?.assets?.totalComputersAgentDistribution
                  ?.series ?? [0, 0]
              }
            /> */}
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mt-3 mt-md-0">
          <div className="card p-2" style={{ height: 250 }}>
            <span className="text-center">Tickets Status Distribution</span>
            <DonutChartClickable
              onSelect={(label) => handleStatusTrigger(label)}
              data={donutData(
                dashboardData?.tickets?.ticketsStatusDist?.labels,
                dashboardData?.tickets?.ticketsStatusDist?.series
              )}
            />
          </div>
          <div className="card p-2 mt-3" style={{ height: 250 }}>
            <span className="text-center">Tickets Category Distribution</span>
            <DonutChart
              data={[
                { label: "Apples", value: 44 },
                { label: "Bananas", value: 55 },
                { label: "Cherries", value: 13 },
                { label: "Dates", value: 33 },
              ]}
            />
          </div>
        </div>

        <div className="col-12 col-lg-4 col-xl-6 mt-3 mt-md-0">
          <div className="card p-3 h-100">
            <BarChart
              gradientColor={"#56b49a"}
              title={`${dashboardData?.ticketsByStatusCount?.status
                ?.charAt(0)
                .toUpperCase()}${dashboardData?.ticketsByStatusCount?.status?.slice(
                1
              )} Tickets Distribution Over Time`}
              labels={dashboardData?.ticketsByStatusCount?.dates}
              seriesWithData={[
                {
                  name: `${dashboardData?.ticketsByStatusCount?.status} Tickets`,
                  data: dashboardData?.ticketsByStatusCount?.data ?? [0, 0],
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12 col-md-4">
          <div className="card p-2">
            <HorizontalBarChart
              gradientColor={"var(--color-dark-gray)"}
              title="Top 5 Assignees"
              labels={dashboardData.tickets.topFiveAssigneedUser.map(
                (user: any) => user.assignee_name
              )}
              series={dashboardData.tickets.topFiveAssigneedUser.map(
                (user: any) => user.ticket_count
              )}
              xTitle="Tickets"
              yTitle="Assignees"
            />
          </div>
        </div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <div className="card p-2">
            <HorizontalBarChart
              gradientColor="var(--color-p5)"
              title="Asset Distribution"
              series={[
                dashboardData.assets.totalComputers,
                dashboardData.assets.totalPhones,
                dashboardData.assets.totalRacks,
                dashboardData.assets.totalMonitors,
                dashboardData.assets.totalOS,
              ]}
              labels={labels}
              yTitle="Asset Type"
            />
          </div>
        </div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <div className="card p-2">
            <LineChart
              colors={["#c91a20", "#00ae47", "#6d6875"]}
              series={dashboardData.tickets.totalTicketsByPriority.series}
              labels={dashboardData.tickets.totalTicketsByPriority.months}
              xTitle={"Month"}
              yTitle={"Tickets"}
              title={"Priority Distribution – Last 3 Months"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardLanding };
