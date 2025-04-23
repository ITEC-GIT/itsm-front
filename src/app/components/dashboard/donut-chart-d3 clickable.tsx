import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { wrapText } from "./donut-chart-d3";

interface DonutChartProps {
  data: { label: string; value: number }[];
  innerRadius?: number;
  outerRadiusOffset?: number;
  colors?: string[];
  title?: string;
  onSelect?: (selectedLabel: string | null) => void;
}

const DonutChartClickable: React.FC<DonutChartProps> = ({
  data,
  innerRadius = 10,
  outerRadiusOffset = 55,
  colors,
  title,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasNoData =
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every((d) => !d.value || d.value === 0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const radius = Math.min(width, height) / 3;
    const dynamicInnerRadius = radius * 0.6;
    const dynamicOuterOffset = radius * 0.1;
    const outerRadius = radius - dynamicOuterOffset;
    const labelOffset = radius * 0.01;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (hasNoData) {
      svg
        .append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", dimensions.height / 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#999")
        .text("No data available");
      return;
    }

    if (title) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .attr("font-size", Math.max(radius * 0.12, 14))
        .attr("font-weight", "bold")
        .text(title);
    }

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = colors
      ? d3
          .scaleOrdinal<string>()
          .domain(data.map((d, i) => i.toString()))
          .range(colors)
      : d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.07);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(dynamicInnerRadius)
      .outerRadius((d) =>
        d.index === selectedIndex || d.index === hoveredIndex
          ? outerRadius + 8
          : outerRadius
      );

    const outerArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(outerRadius + 20)
      .outerRadius(outerRadius + 10);

    const pieData = pie(data);
    const tooltip = tooltipRef.current;

    g.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d, i) => color(i.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("opacity", (d) =>
        selectedIndex === null || d.index === selectedIndex ? 1 : 0.5
      )
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        const newIndex = selectedIndex === d.index ? null : d.index;
        setSelectedIndex(newIndex);
        if (onSelect) {
          onSelect(newIndex !== null ? d.data.label : null);
        }
      })
      .on("mousemove", (event, d) => {
        setHoveredIndex(d.index);
        if (tooltip && containerRef.current) {
          const bounds = containerRef.current.getBoundingClientRect();
          const x = event.clientX - bounds.left;
          const y = event.clientY - bounds.top;
          const segmentColor = color(d.index.toString());
          const htmlCode = `<div class="d-flex flex-column p-2" style={{ zIndex: "99999" }}>
            <span>Count</span>
            <div class="d-flex align-items-center">
              <span style="
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${segmentColor};
                margin-right: 6px;
                vertical-align: middle;
              "></span>
              ${d.data.label}: ${d.data.value}
            </div>
          </div>`;

          tooltip.style.display = "block";
          tooltip.style.left = `${x + 10}px`;
          tooltip.style.top = `${y}px`;
          tooltip.style.color = `${segmentColor}`;
          tooltip.style.border = `1px solid ${segmentColor}`;
          tooltip.innerHTML = htmlCode;
        }
      })
      .on("mouseleave", () => {
        setHoveredIndex(null);
        if (tooltip) tooltip.style.display = "none";
      });

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
          outerArc.centroid(d)[0] > 0
            ? outerRadius + labelOffset
            : -outerRadius - labelOffset;

        return [posA, posB, posC].map((point) => point.join(",")).join(" ");
      });

    const labels = pieData.map((d) => {
      const pos = outerArc.centroid(d);
      return {
        ...d,
        x: pos[0],
        y: pos[1],
        text: d.data.label,
      };
    });

    labels.sort((a, b) => a.y - b.y);
    const spacing = 14;
    for (let i = 1; i < labels.length; i++) {
      if (labels[i].y - labels[i - 1].y < spacing) {
        labels[i].y = labels[i - 1].y + spacing;
      }
    }

    const textSelection = g
      .selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .text((d) => d.text)
      .attr(
        "transform",
        (d) => `translate(${d.x > 0 ? outerRadius : -outerRadius - 1},${d.y})`
      )
      .style("text-anchor", (d) => (d.x > 0 ? "start" : "end"))
      .style("alignment-baseline", "middle");

    wrapText(textSelection, 60);
  }, [data, dimensions, innerRadius, outerRadiusOffset, selectedIndex]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedIndex(null);
        if (onSelect) onSelect(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
      ></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          height: "60px",
          background: "white",
          fontSize: "12px",
          borderRadius: "4px",
          pointerEvents: "none",
          display: "none",
          whiteSpace: "nowrap",
          textAlign: "start",
        }}
      ></div>
    </div>
  );
};

export default DonutChartClickable;
