"use client";

import { toastNotify } from "@/app/helper";
import { useEffect, useState } from "react";

// Định nghĩa type Participant
type Participant = {
  api_url: string;
  display_name: string;
  role: string;
  is_muted: "YES" | "NO";
  is_video_muted: boolean;
  is_connected: boolean;
  local_alias: string;
  protocol: string;
  device: string; // Tên thiết bị
};

export default function MeetingAttendeesList() {
  const [attendees, setAttendees] = useState<Participant[]>([]); // Dữ liệu người tham gia
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi API

  // Hàm fetch API để lấy dữ liệu attendees
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toastNotify("Token not found in localStorage", "error");
      return;
    }

    const fetchAttendees = async () => {
      try {
        const response = await fetch(
          "https://10.9.30.16/api/client/v2/conferences/LabMeeting/participants?",
          {
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
              token: token as string,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const responseBody = await response.json();

        // Ánh xạ dữ liệu từ API vào Participant[]
        const mappedAttendees: Participant[] = responseBody.result.map(
          (participant: any) => ({
            api_url: participant.api_url,
            display_name: participant.display_name || "Unknown",
            role: participant.role || "Participant",
            is_muted: participant.is_muted || "NO",
            is_video_muted: participant.is_video_muted || false,
            is_connected: participant.has_media || false,
            local_alias: participant.local_alias || "N/A",
            protocol: participant.protocol || "Unknown",
            device: simplifyDeviceName(participant.vendor || "Unknown Device"),
          })
        );

        setAttendees(mappedAttendees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setError("Failed to fetch attendees data.");
        setLoading(false);
      }
    };

    // Thiết lập interval để cập nhật real-time
    const interval = setInterval(fetchAttendees, 1000); // Gọi lại mỗi 5 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600">Loading attendees...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  // UI hiển thị danh sách attendees
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="border-b border-gray-300 p-4">
        <h3 className="text-lg font-semibold">Meeting Attendees List</h3>
      </div>

      {/* Table */}
      <div className="p-4 w-full overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Alias
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Protocol
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Device
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.api_url}>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.display_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      attendee.is_connected
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {attendee.is_connected ? "Connected" : "Disconnected"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.local_alias}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.protocol}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {attendee.device}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-2">
                    {/* Mic Button */}
                    <button
                      className={`rounded ${
                        attendee.is_muted === "YES"
                          ? "bg-gray-800 px-3 text-white"
                          : "bg-blue-500 px-2 text-white"
                      } hover:bg-blue-600`}
                      title={attendee.is_muted === "YES" ? "Unmute" : "Mute"}
                    >
                      <i
                        className={`fa-solid ${
                          attendee.is_muted === "YES"
                            ? "fa-microphone"
                            : "fa-microphone-slash"
                        }`}
                      ></i>
                    </button>

                    {/* Video Button */}
                    <button
                      className={`p-2 rounded ${
                        attendee.is_video_muted
                          ? "bg-gray-800 text-white"
                          : "bg-blue-500 text-white"
                      } hover:bg-blue-600`}
                      title={
                        attendee.is_video_muted
                          ? "Enable Video"
                          : "Disable Video"
                      }
                    >
                      <i
                        className={`fa-solid ${
                          attendee.is_video_muted
                            ? "fa-video-slash"
                            : "fa-video"
                        }`}
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function simplifyDeviceName(vendor: string): string {
  if (vendor.includes("Windows")) return "Windows";
  if (vendor.includes("Macintosh")) return "MacOS";
  if (vendor.includes("Android")) return "Android";
  if (vendor.includes("iPhone") || vendor.includes("iPad")) return "iOS";
  if (vendor.includes("Linux")) return "Linux";
  if (vendor.includes("Chrome")) return "Chrome Browser";
  if (vendor.includes("Firefox")) return "Firefox Browser";
  return vendor.split(" ")[0]; // Lấy phần đầu tiên của chuỗi nếu không khớp
}
