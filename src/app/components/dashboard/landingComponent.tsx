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
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

// const PieChart = ({ gradientColor, title, series }: GradientPieChartProps) => {
//   const options: ApexOptions = {
//     chart: {
//       type: "donut",
//       animations: { enabled: false },
//       redrawOnParentResize: true,
//     },
//     colors: [gradientColor],
//     fill: {
//       type: "fill",
//       // gradient: {
//       //   gradientToColors: [gradientColor],
//       // stops: [0, 100],
//       // shadeIntensity: 1,
//       // opacityFrom: 0.7,
//       // opacityTo: 0.9,
//       // },
//     },
//     plotOptions: {
//       pie: {
//         expandOnClick: false,
//         donut: {
//           size: "65%",
//           labels: {
//             show: false,
//             // total: {
//             //   show: true,
//             //   label: title,
//             //   color: "#333",
//             //   fontSize: "14px",
//             // },
//           },
//         },
//       },
//     },
//     dataLabels: { enabled: false },
//     legend: { show: false },
//     responsive: [
//       {
//         breakpoint: 768,
//         options: {
//           plotOptions: {
//             pie: { donut: { size: "60%" } },
//           },
//         },
//       },
//     ],
//   };

//   return (
//     <div style={{ width: "100%", height: "150px", minHeight: "200px" }}>
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="donut"
//         height="100%"
//         width="100%"
//       />
//     </div>
//   );
// };

const TicketsBarChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      animations: { enabled: false },
      redrawOnParentResize: true,
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      parentHeightOffset: 0,
      height: "100%",
    },
    colors: [
      "var(--color-p1)",
      "var(--color-p2)",
      "var(--color-p3)",
      "var(--color-p4)",
    ],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 0,
          },
          plotOptions: {
            bar: {
              borderRadius: 1,
              columnWidth: "60%",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "70%",
              dataLabels: {
                total: {
                  style: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 1,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "clamp(10px, 1.2vw, 13px)",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      type: "datetime",
      categories: [
        "01/01/2011 GMT",
        "01/02/2011 GMT",
        "01/03/2011 GMT",
        "01/04/2011 GMT",
        "01/05/2011 GMT",
        "01/06/2011 GMT",
      ],
      labels: {
        style: {
          fontSize: "clamp(10px, 1vw, 12px)",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "clamp(10px, 1vw, 12px)",
        },
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
      fontSize: "clamp(10px, 1vw, 12px)",
      // markers: {
      //   width: 12,
      //   height: 12,
      //   radius: 0,
      // },
      itemMargin: {
        horizontal: 5,
        vertical: 3,
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const [state] = useState({
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "PRODUCT D",
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
  });

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "350px" }}>
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
      text: "Monthly Inflation in Argentina, 2002",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
        fontSize: "clamp(12px, 1.5vw, 14px)",
      },
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
    <div style={{ width: "100%", height: "250px" }}>
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
        <div className="col-12 col-lg-6">
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
              {
                bg: "var(--color-light-olive)",
                color: "var(--color-dark-olive)",
                icon: "fa-server",
                number: 500559,
                title: "Racks",
              },
              {
                bg: "var(--color-light-yellow)",
                color: "var(--color-dark-yellow)",
                icon: "fa-print",
                number: 5,
                title: "Printers",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-4"
              >
                <StatBox {...stat} />
              </div>
            ))}
          </div>
          <div className="row g-3 mt-1">
            <div className="col-4">
              <div
                className="card p-2"
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieChart
                  gradientColor="#FFA955" //""
                  title="Sales Distribution"
                  series={[35, 40, 25]}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card p-2" style={{ height: "100%" }}>
                <PieChart
                  gradientColor="#F75A5A" //"var(--color-brown)"
                  title="Sales Distribution"
                  series={[35, 40, 25]}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card p-2" style={{ height: "100%" }}>
                <PieChart
                  gradientColor="#9d4edd" //"var(--color-brown)"
                  title="Sales Distribution"
                  series={[35, 40, 25]}
                />
              </div>
            </div>
          </div>
          <div className="row g-3 mt-1">
            {[
              {
                bg: "var(--color-light-gray)",
                color: "var(--color-dark-gray)",
                icon: "fa-cubes",
                number: 10,
                title: "Software",
              },
              {
                bg: "var(--color-dark-orange)",
                color: "var(--color-light-orange)",
                icon: "fa-desktop",
                number: 150,
                title: "Computers",
              },
              {
                bg: "var(--color-light-purple)",
                color: "var(--color-dark-purple)",
                icon: "fa-network-wired",
                number: 33,
                title: "Networks",
              },
              // {
              //   bg: "var(--color-light-orange)",
              //   color: "var(--color-dark-orange)",
              //   icon: "fa-phone",
              //   number: 0,
              //   title: "Phones",
              // },
              // {
              //   bg: "var(--color-light-green)",
              //   color: "var(--color-dark-green)",
              //   icon: "fa-key",
              //   number: 130,
              //   title: "Licenses",
              // },
              // {
              //   bg: "var(--color-dark-blue)",
              //   color: "var(--color-light-blue)",
              //   icon: "fa-tv",
              //   number: 92,
              //   title: "Monitors",
              // },
            ].map((stat, index) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-4"
              >
                <StatBox {...stat} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="row">
            <div className="col-12">
              <div className="card p-3" style={{ height: "100%" }}>
                <BarChart />
              </div>
            </div>
          </div>
          <div className="row mt-3 g-3">
            {[
              {
                bg: "var(--color-p1)",
                color: "var(--color-light-green)",
                icon: "fa-cubes",
                number: 10,
                title: "Software",
              },
              {
                bg: "var(--color-p5)",
                color: "var(--color-p10)",
                icon: "fa-desktop",
                number: 150,
                title: "Computers",
              },
              {
                bg: "var(--color-p11)",
                color: "var(--color-light-gray)",
                icon: "fa-network-wired",
                number: 33,
                title: "Networks",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-4 "
              >
                <StatBox {...stat} />
              </div>
            ))}
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card p-2" style={{ height: "100%" }}>
                <HorizontalBarChart color={"var(--color-dark-gray)"} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-2" style={{ height: "100%" }}>
                <HorizontalBarChart color={"var(--color-p5)"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardLanding };
