"use client";

import { toastNotify } from "@/app/helper";
import { useEffect, useState } from "react";

export default function ListMCUOperation() {
  interface MCUObject {
    hostname: string;
    address: string;
  }

  interface MCUData {
    objects: MCUObject[];
  }

  const [data, setData] = useState<MCUData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi tới server của bạn
        const res = await fetch("/api/worker_vm", {
          method: "GET",
        });

        // Kiểm tra trạng thái phản hồi
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json(); // Parse JSON từ server
        console.log("result", result);
        setData(result); // Lưu dữ liệu vào state
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Lưu lỗi vào state
          toastNotify(error.message, "error");
        } else {
          setError("An unknown error occurred");
          toastNotify("An unknown error occurred", "error");
        }
      }
    };

    fetchData();
  }, []); // Chạy useEffect chỉ một lần khi component được mount

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full h-full">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">List MCU</h3>
  
    {error ? (
      <div className="text-red-500">{error}</div>
    ) : data ? (
      <ul className="space-y-2">
        {data.objects.map((mcu, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105"
          >
            <span className="text-gray-700 font-medium">
              Hostname: {mcu.hostname}
            </span>
            <span className="text-gray-500">Address: {mcu.address}</span>
          </li>
        ))}
      </ul>
    ) : (
      <div>Loading...</div>
    )}
  </div>
  
  );
}
