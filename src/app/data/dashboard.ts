import { ChartType } from "../types/dashboard";

export const chartSideBarItems = [
  {
    id: 1,
    title: "Asset Overview",
    charts: [
      {
        id: 1,
        title: "Distribution of assets by category",
        type: "Polar Area Chart",
      },
      {
        id: 2,
        title: "Number of assets per asset type",
        type: "Bar Chart",
      },
    ],
  },
  {
    id: 2,
    title: "Ticket Statistics",
    charts: [
      {
        id: 3,
        title: "Number of tickets created over time",
        type: "Line Chart",
      },
      {
        id: 4,
        title: "Number of tickets created over time",
        type: "Line Chart",
      },
      {
        id: 5,
        title: "Ticket status by category",
        type: "Stacked Bar Chart",
      },
      {
        id: 6,
        title: "Number of tickets per asset",
        type: "Bar Chart",
      },
      {
        id: 7,
        title: "Distribution of tickets by priority",
        type: "Pie Chart",
      },
    ],
  },
  {
    id: 3,
    title: "Ticket Resolution Metrics",
    charts: [
      {
        id: 8,
        title: "Average resolution time per ticket type",
        type: "Bar Chart",
      },
      { id: 9, title: "Resolution time over time", type: "Line Chart" },
    ],
  },
  {
    id: 4,
    title: "Asset Action Overview",
    charts: [
      { id: 10, title: "Actions taken on assets", type: "Pie Chart" },
      {
        id: 11,
        title: "Number of actions performed per asset type",
        type: "Bar Chart",
      },
      {
        id: 12,
        title: "The frequency of actions over time",
        type: "Line Chart",
      },
    ],
  },
  {
    id: 5,
    title: "Branch Comparison",
    charts: [
      {
        id: 13,
        title: "Ticket Status",
        type: "Bar Chart",
      },
      { id: 14, title: "Visualize performance metrics", type: "Heatmap Chart" },
    ],
  },
  {
    id: 6,
    title: "Hardware VS Software Ticket Distribution",
    charts: [
      {
        id: 15,
        title: "Open Tickets",
        type: "Pie Chart",
      },
      {
        id: 16,
        title: "Pending Tickets",
        type: "Pie Chart",
      },
      {
        id: 17,
        title: "Closed Tickets",
        type: "Pie Chart",
      },
      {
        id: 18,
        title: "Solved Tickets",
        type: "Pie Chart",
      },
    ],
  },
];

export const chartConfig: Record<ChartType, { options: any; series: any }> = {
  // "Pie Chart": {
  //   options: {
  //     chart: { type: "donut" },
  //     labels: ["High", "Medium", "Low", "Very Low"],
  //     colors: ["#FF6384", "#36A2EB", "#FFCE56", "#FFCF76"],
  //     width: 300,
  //     height: 300,
  //     // responsive: [
  //     //   {
  //     //     breakpoint: 2400,
  //     //     options: {
  //     //       chart: {
  //     //         width: 400,
  //     //       },
  //     //       legend: {
  //     //         position: "bottom",
  //     //       },
  //     //     },
  //     //   },
  //     //   {
  //     //     breakpoint: 1600,
  //     //     options: {
  //     //       chart: {
  //     //         width: 500,
  //     //       },
  //     //       legend: {
  //     //         position: "bottom",
  //     //       },
  //     //     },
  //     //   },
  //     //   {
  //     //     breakpoint: 1200,
  //     //     options: {
  //     //       chart: {
  //     //         width: 200,
  //     //         height: 250,
  //     //       },
  //     //       legend: {
  //     //         position: "bottom",
  //     //       },
  //     //     },
  //     //   },
  //     //   {
  //     //     breakpoint: 768,
  //     //     options: {
  //     //       chart: {
  //     //         width: 400,
  //     //       },
  //     //       legend: {
  //     //         position: "bottom",
  //     //       },
  //     //     },
  //     //   },
  //     //   {
  //     //     breakpoint: 480,
  //     //     options: {
  //     //       chart: {
  //     //         width: 250,
  //     //       },
  //     //       legend: {
  //     //         position: "bottom",
  //     //       },
  //     //     },
  //     //   },
  //     // ],
  //   },
  //   series: [110, 80, 50, 10],
  "Pie Chart": {
    options: {
      chart: { type: "donut" },
      labels: ["High", "Medium", "Low", "Very Low"],
      colors: ["#FF6384", "#36A2EB", "#FFCE56", "#FFCF76"],
      // width: 300,
      // height: 350,
      responsive: [
        {
          breakpoint: 2400,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 1600,
          options: {
            chart: {
              width: 500,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 1200,
          options: {
            chart: {
              width: 200,
              height: 250,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series: [110, 80, 50, 10],
  },

  // "Pie Chart": {
  //   // series: [44, 55, 41, 17, 15],
  //   // options: {
  //   //   chart: {
  //   //     width: 380,
  //   //     type: "donut",
  //   //   },
  //   //   plotOptions: {
  //   //     pie: {
  //   //       startAngle: -90,
  //   //       endAngle: 270,
  //   //     },
  //   //   },
  //   //   dataLabels: {
  //   //     enabled: false,
  //   //   },
  //   //   fill: {
  //   //     type: "gradient",
  //   //   },
  //   //   legend: {
  //   //     formatter: function (val: string, opts: any) {
  //   //       return val + " - " + opts.w.globals.series[opts.seriesIndex];
  //   //     },
  //   //   },
  //   //   // title: {
  //   //   //   text: "Gradient Donut with custom Start-angle",
  //   //   // },
  //   //   // responsive: [
  //   //   //   {
  //   //   //     breakpoint: 480,
  //   //   //     options: {
  //   //   //       chart: {
  //   //   //         width: 200,
  //   //   //       },
  //   //   //       legend: {
  //   //   //         position: "bottom",
  //   //   //       },
  //   //   //     },
  //   //   //   },
  //   //   // ],
  //   // },
  //   options: {
  //     chart: { type: "donut" },
  //     labels: ["High", "Medium", "Low"],
  //     colors: ["#FF6384", "#36A2EB", "#FFCE56"],
  //     responsive: [
  //       {
  //         breakpoint: 2400,
  //         options: {
  //           chart: {
  //             width: 500,
  //           },
  //           legend: {
  //             position: "bottom",
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   series: [120, 80, 50],
  // },
  "Bar Chart": {
    options: {
      chart: { type: "bar" },
      xaxis: {
        categories: [
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
          "Branch A",
          "Branch B",
          "Branch C",
        ],
      },
      colors: [
        "#4BC0C0",
        "#FF6384",
        "#36A2EB",
        "#4BC0C0",
        "#FF6384",
        "#36A2EB",
        "#4BC0C0",
        "#FF6384",
        "#36A2EB",
        "#4BC0C0",
        "#FF6384",
        "#36A2EB",
      ],
      // width: 300,
      // height: 350,
      // responsive: [
      //   {
      //     breakpoint: 2400,
      //     options: {
      //       chart: {
      //         width: 400,
      //         height: 300,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      //   {
      //     breakpoint: 1600,
      //     options: {
      //       chart: {
      //         width: 450,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      //   {
      //     breakpoint: 1200,
      //     options: {
      //       chart: {
      //         width: 200,
      //         height: 235,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      //   {
      //     breakpoint: 768,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 250,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      // ],
    },

    series: [
      {
        name: "Assets",
        data: [
          120, 200, 150, 120, 200, 150, 120, 200, 150, 120, 200, 150, 120, 200,
          150, 120, 200, 150, 120, 200, 150, 120, 200, 150,
        ],
      },
    ],
  },
  "Line Chart": {
    options: {
      chart: { type: "line" },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
      stroke: { curve: "smooth" },
      colors: ["#FF6384"],
      width: 300,
      height: 350,
    },
    series: [
      {
        name: "Tickets Over Time",
        data: [50, 75, 100, 150, 200],
      },
    ],
  },
  "Stacked Bar Chart": {
    options: {
      chart: { type: "bar", stacked: true },
      xaxis: { categories: ["Branch A", "Branch B", "Branch C"] },
      colors: ["#36A2EB", "#FFCE56", "#FF6384"],
      width: 300,
      height: 350,
    },
    series: [
      {
        name: "Open Tickets",
        data: [30, 50, 20],
      },
      {
        name: "Resolved Tickets",
        data: [60, 100, 80],
      },
    ],
  },
  "Gauge Chart": {
    options: {
      width: 300,
      height: 350,
      chart: { type: "radialBar" },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { show: true },
            value: { show: true, fontSize: "16px" },
          },
        },
      },
      colors: ["#FF6384"],
    },
    series: [83],
  },
  "Heatmap Chart": {
    options: {
      width: 300,
      height: 350,
      chart: { type: "heatmap" },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              //<=== here
              { from: 0, to: 50, color: "#FF6384" },
              { from: 51, to: 100, color: "#36A2EB" },
              { from: 101, to: 150, color: "#FFCE56" },
            ],
          },
        },
      },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
    },
    series: [
      {
        name: "Metric A",
        data: [30, 70, 100, 90, 120],
      },
      {
        name: "Metric B",
        data: [60, 80, 120, 110, 150],
      },
    ],
  },

  "Polar Area Chart": {
    series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
    options: {
      chart: {
        type: "polarArea",
      },
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      // width: 300,
      // height: 350,
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      // ],
    },
  },
};

type DynamicChartData = {
  categories?: string[];
  series?: any[];
  values?: number[];
  colors?: string[];
  labels?: string[];
};

export const GetChartConfig = (
  chartType: ChartType,
  dynamicData: DynamicChartData
) => {
  switch (chartType) {
    case "Pie Chart":
      return {
        options: {
          chart: { type: "pie" },
          labels: dynamicData.labels || ["High", "Medium", "Low"],
          colors: dynamicData.colors || ["#FF6384", "#36A2EB", "#FFCE56"],
          // responsive: [
          //   {
          //     breakpoint: 2400,
          //     options: {
          //       chart: {
          //         width: 400,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 1600,
          //     options: {
          //       chart: {
          //         width: 500,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 1200,
          //     options: {
          //       chart: {
          //         width: 200,
          //         height: 250,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 768,
          //     options: {
          //       chart: {
          //         width: 400,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 480,
          //     options: {
          //       chart: {
          //         width: 250,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          // ],
        },
        series: dynamicData.values || [],
      };

    case "Bar Chart":
      return {
        options: {
          chart: { type: "bar" },
          xaxis: { categories: dynamicData.categories || [] },
          colors: dynamicData.colors || ["#4BC0C0", "#FF6384", "#36A2EB"],
          // responsive: [
          //   {
          //     breakpoint: 2400,
          //     options: {
          //       chart: {
          //         width: 400,
          //         height: 300,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 1600,
          //     options: {
          //       chart: {
          //         width: 450,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 1200,
          //     options: {
          //       chart: {
          //         width: 200,
          //         height: 235,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 768,
          //     options: {
          //       chart: {
          //         width: 200,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          //   {
          //     breakpoint: 480,
          //     options: {
          //       chart: {
          //         width: 250,
          //       },
          //       legend: {
          //         position: "bottom",
          //       },
          //     },
          //   },
          // ],
        },
        series: [
          {
            name: "Assets",
            data: dynamicData.values || [],
          },
        ],
      };

    case "Line Chart":
      return {
        options: {
          chart: { type: "line" },
          xaxis: { categories: dynamicData.categories || [] },
          stroke: { curve: "smooth" },
          colors: dynamicData.colors || ["#FF6384"],
        },
        series: [
          {
            name: "Tickets Over Time",
            data: dynamicData.values || [],
          },
        ],
      };

    case "Stacked Bar Chart":
      return {
        options: {
          chart: { type: "bar", stacked: true },
          xaxis: { categories: dynamicData.categories || [] },
          colors: dynamicData.colors || ["#36A2EB", "#FFCE56", "#FF6384"],
        },
        series: dynamicData.series || [],
      };

    case "Gauge Chart":
      return {
        options: {
          chart: { type: "radialBar" },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: { show: true },
                value: { show: true, fontSize: "16px" },
              },
            },
          },
          colors: dynamicData.colors || ["#FF6384"],
        },
        series: dynamicData.values || [],
      };

    case "Heatmap Chart":
      return {
        options: {
          chart: { type: "heatmap" },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              colorScale: {
                ranges: [
                  { from: 0, to: 50, color: "#FF6384" },
                  { from: 51, to: 100, color: "#36A2EB" },
                  { from: 101, to: 150, color: "#FFCE56" },
                ],
              },
            },
          },
          xaxis: { categories: dynamicData.categories || [] },
        },
        series: dynamicData.series || [],
      };

    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
};
