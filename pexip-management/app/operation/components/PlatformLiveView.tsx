import React, { useEffect, useState } from "react";
import axios from "axios";
import * as d3 from "d3";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { toastNotify } from "@/app/helper";
import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Types
type WorkerVM = {
  id: number;
  name: string;
  address: string;
  node_type: string;
};

export default function PlatformLiveView() {
  const [workers, setWorkers] = useState<WorkerVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleMenu } = useToggleMenu();

  // Fetch data from API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("/api/worker_vm"); // API endpoint
        setWorkers(response.data.objects); // Lưu dữ liệu vào state
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch worker VM data.");
        toastNotify("Failed to fetch worker VM data.", "error");
        setLoading(true);
      }
    };

    // call set time 10 seconds
    fetchWorkers();
  }, []);

  // Tạo sơ đồ mạng (Network Diagram)
  const createNetworkDiagram = (data: WorkerVM[]) => {
    const width = 400; // Chiều rộng SVG nhỏ hơn
    const height = 400; // Chiều cao SVG nhỏ hơn

    // Xóa nội dung cũ trước khi thêm mới
    d3.select("#network-diagram").selectAll("*").remove();

    // Tạo SVG với group cho zoom
    const svg = d3
      .select("#network-diagram")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`) // Đặt viewBox để phù hợp với box bên ngoài
      .attr("preserveAspectRatio", "xMidYMid meet") // Đảm bảo tỷ lệ không bị thay đổi
      .classed("svg-content", true);

    const g = svg.append("g"); // Group để chứa tất cả nội dung (nodes & links)

    // Kích hoạt zoom & pan
    svg.call(
      d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform); // Cập nhật transform khi zoom hoặc pan
      })
    );

    // Nodes
    const nodes = data.map((worker) => ({
      id: worker.id,
      name: worker.name,
      x: 0,
      y: 0,
    }));

    // Links (mock links for demonstration)
    const links = nodes.map((node, index) => ({
      source: node.id,
      target: nodes[(index + 1) % nodes.length].id,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = g
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2);

    // Draw nodes
    const node = g
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#69b3a2")
      .call(
        d3
          .drag()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Add text labels
    const labels = g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "-20") // Vị trí phía trên node
      .text((d: any) => d.name);

    // Update simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });
  };

  // Render sơ đồ mạng khi có dữ liệu
  useEffect(() => {
    if (workers.length > 0) {
      createNetworkDiagram(workers);
    }
  }, [workers]);

  // Dữ liệu cho biểu đồ Pie
  const pieData = {
    labels: ["Conferencing", "Proxying"],
    datasets: [
      {
        data: [
          workers.filter((worker) => worker.node_type === "CONFERENCING")
            .length,
          workers.filter((worker) => worker.node_type === "PROXYING").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };


  return (
    <>
      {toggleMenu.isWorkerNodes && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full ">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Worker Nodes</h3>
          {!loading ? (
            <>
              <div className="mb-6">
                <ul className="space-y-4">
                  {workers.map((worker) => (
                    <li
                      key={worker.id}
                      className="p-4 border rounded-lg shadow-sm bg-gray-100 hover:shadow-md transition"
                    >
                      <p>
                        <strong>Name:</strong> {worker.name}
                      </p>
                      <p>
                        <strong>Address:</strong> {worker.address}
                      </p>
                      <p>
                        <strong>Type:</strong> {worker.node_type}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="network-diagram" className="relative border bg-white">
                <h2 className="absolute top-0 left-0 p-2 bg-white">
                  Network Diagram
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Worker Node Types
                </h3>
                <div className="flex justify-center">
                  <div className="lg:w-1/2">
                    <Pie data={pieData} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {error ? (
                <>
                  <p className="text-center text-red-600">{error}</p>
                </>
              ) : (
                <>
                  <p className="text-center text-blue-600">Loading...</p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
