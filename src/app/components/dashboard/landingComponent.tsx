import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface GradientPieChartProps {
  gradientColor: string;
  title: string;
  series: number[];
}

const PieChart = ({ gradientColor, title, series }: GradientPieChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      animations: { enabled: false },
      redrawOnParentResize: true,
    },
    colors: [gradientColor],
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: [gradientColor],
        stops: [0, 100],
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "70%", // Adjust this to control the donut hole size
          labels: {
            show: false,
          },
        },
        offsetY: 0,
        customScale: 1.0,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
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
    </div>
  );
};

const BarChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: "100%",
      animations: { enabled: false },
      redrawOnParentResize: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "clamp(10px, 1.2vw, 12px)",
        colors: ["#56b49a"],
      },
    },
    colors: ["#56b49a"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "clamp(10px, 1.2vw, 12px)",
        },
        rotate: -45, // Rotate labels for better fit on mobile
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          fontSize: "clamp(10px, 1.2vw, 12px)",
        },
      },
      max: 12,
    },
    title: {
      text: undefined,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "60%",
            },
          },
          dataLabels: {
            offsetY: -15,
          },
          title: {
            offsetY: 10,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
              borderRadius: 1,
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };

  const [state] = useState({
    series: [
      {
        name: "Inflation",
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
      },
    ],
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "350px",
        position: "relative",
      }}
    >
      <ReactApexChart
        options={options}
        series={state.series}
        type="bar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

const HorizontalBarChart = ({ color }: { color: string }) => {
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
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: ["France", "Japan", "United States", "China", "Germany"],
    },
    colors: [color],
  };

  const series = [
    {
      name: "Countries",
      data: [400, 540, 690, 1100, 1380],
    },
  ];

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height="100%"
        width="100%"
      />
    </div>
  );
};

const LineChart = () => {
  const series = [
    {
      name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: "100%", // Changed from fixed 350 to percentage
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2, // Reduced opacity for better mobile visibility
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true, // Essential for responsiveness
      parentHeightOffset: 0, // Prevents overflow
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "clamp(10px, 1.2vw, 12px)", // Responsive font size
      },
    },
    stroke: {
      curve: "smooth",
      width: 3, // Slightly thicker lines for mobile
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 4, // Slightly larger markers
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      title: {
        text: "Month",
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
      title: {
        text: "Temperature",
        style: {
          fontSize: "clamp(12px, 1.3vw, 14px)",
        },
      },
      min: 5,
      max: 40,
      labels: {
        style: {
          fontSize: "clamp(10px, 1.1vw, 12px)",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
      fontSize: "clamp(12px, 1.3vw, 14px)",
      markers: {
        strokeWidth: 2,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            dropShadow: {
              blur: 1, // Less shadow on smaller screens
            },
          },
          markers: {
            size: 3,
          },
          dataLabels: {
            enabled: false, // Hide data labels on small screens
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
            width: 2, // Thinner lines on very small screens
          },
          markers: {
            size: 2,
          },
          grid: {
            show: false, // Hide grid on very small screens
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

const DashboardLanding = () => {
  return (
    <div className="container-fluid px-3 px-sm-4 py-3">
      <div className="row g-3">
        {[
          {
            bg: "var(--color-dark-gray)",
            color: "var(--color-light-gray)",
            icon: "fa-cubes",
            number: 10,
            title: "Software",
          },
          {
            bg: "var(--color-dark-red)",
            color: "var(--color-light-red)",
            icon: "fa-desktop",
            number: 150,
            title: "Computers",
          },
          {
            bg: "var(--color-light-pink)",
            color: "var(--color-dark-pink)",
            icon: "fa-network-wired",
            number: 33,
            title: "Networks",
          },
          {
            bg: "var(--color-light-orange)",
            color: "var(--color-dark-orange)",
            icon: "fa-phone",
            number: 0,
            title: "Phones",
          },
          {
            bg: "var(--color-light-green)",
            color: "var(--color-dark-green)",
            icon: "fa-key",
            number: 130,
            title: "Licenses",
          },
          {
            bg: "var(--color-dark-blue)",
            color: "var(--color-light-blue)",
            icon: "fa-tv",
            number: 92,
            title: "Monitors",
          },
        ].map((stat, index) => (
          <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-2">
            <StatBox {...stat} />
          </div>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col-12 col-sm-6 col-md-6 col-lg-3">
          <div className="card p-2">
            <PieChart
              gradientColor="#FFA955"
              title="Sales Distribution"
              series={[35, 40, 25]}
            />
          </div>
          <div className="card p-2 mt-3">
            <PieChart
              gradientColor="#F75A5A"
              title="Sales Distribution"
              series={[35, 40, 25]}
            />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mt-md-0">
          <div className="card p-2">
            <PieChart
              gradientColor="#F75A5A"
              title="Sales Distribution"
              series={[35, 40, 25]}
            />
          </div>
          <div className="card p-2 mt-3">
            <PieChart
              gradientColor="#F75A5A"
              title="Sales Distribution"
              series={[35, 40, 25]}
            />
          </div>
        </div>

        <div className="col-12 col-lg-6 mt-3 mt-md-0">
          <div className="card p-3 h-100">
            <BarChart />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12 col-md-4">
          <div className="card p-2">
            <HorizontalBarChart color={"var(--color-dark-gray)"} />
          </div>
        </div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <div className="card p-2">
            <HorizontalBarChart color={"var(--color-p5)"} />
          </div>
        </div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <div className="card p-2">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardLanding };
