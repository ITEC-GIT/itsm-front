import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DonutChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  width = 500,
  height = 500,
  innerRadius = 100,
  outerRadius = 150,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const outerArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(outerRadius + 10)
      .outerRadius(outerRadius + 10);

    const pieData = pie(data);

    g.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d, i) => color(i.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    g.selectAll("polyline")
      .data(pieData)
      .enter()
      .append("polyline")
      .attr("stroke", "gray")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("points", (d) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = [...posB];
        posC[0] =
          outerArc.centroid(d)[0] > 0 ? outerRadius + 50 : -outerRadius - 50;
        return [posA, posB, posC].map((point) => point.join(",")).join(" ");
      });

    g.selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .text((d) => d.data.label)
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        pos[0] =
          outerArc.centroid(d)[0] > 0 ? outerRadius + 55 : -outerRadius - 55;
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) =>
        outerArc.centroid(d)[0] > 0 ? "start" : "end"
      )
      .style("alignment-baseline", "middle");
  }, [data, width, height, innerRadius, outerRadius]);

  return <svg ref={ref} width={width} height={height}></svg>;
};

export { DonutChart };
