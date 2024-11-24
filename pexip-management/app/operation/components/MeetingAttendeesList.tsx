"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { toastNotify } from "@/app/helper/index";
import { Participant } from "@/app/interfaces";

type MeetingAttendeesListProps = {
  participants: Participant[];
  handleIndividualMicrophoneMuting: (participant: Participant) => void;
  handleIndividualVideoMuting: (participant: Participant) => void;
};

export default function MeetingAttendeesList({
  handleIndividualVideoMuting,
  handleIndividualMicrophoneMuting,
}: MeetingAttendeesListProps) {
  const [attendees, setAttendees] = useState([]); // Dữ liệu người tham gia
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi khi fetch dữ liệu
  const [searchQuery, setSearchQuery] = useState(""); // Truy vấn tìm kiếm
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("device");
  const participants = [
    {
      api_url: "https://example.com/api/participant/1",
      display_name: "John Doe",
      role: "Host",
      is_muted: "NO",
      is_video_muted: false,
      is_connected: true,
      local_alias: "jdoe",
      protocol: "WebRTC",
      device: "iPhone 14",
    },
    {
      api_url: "https://example.com/api/participant/2",
      display_name: "Jane Smith",
      role: "Participant",
      is_muted: "YES",
      is_video_muted: true,
      is_connected: false,
      local_alias: "jsmith",
      protocol: "SIP",
      device: "MacBook Pro",
    },
    {
      api_url: "https://example.com/api/participant/3",
      display_name: "Alice Johnson",
      role: "Moderator",
      is_muted: "NO",
      is_video_muted: true,
      is_connected: true,
      local_alias: "alicej",
      protocol: "WebRTC",
      device: "Samsung Galaxy S22",
    },
  ];

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const mappedAttendees = participants.map((participant) => ({
          ...participant,
          device: simplifyDeviceName(participant.device || "Unknown Device"),
        }));

        setAttendees(mappedAttendees); // Cập nhật attendees
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setError("Failed to fetch attendees data.");
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  const handleSort = (field: string) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortField(field);

    const sorted = [...attendees].sort((a, b) => {
      if (order === "asc") {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });

    setAttendees(sorted);
  };

  // Lọc attendees dựa trên searchQuery
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.local_alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-blue-600">Loading attendees...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="border-b border-gray-300 p-4">
        <div className="flex justify-between pt-2">
          <h3 className="text-lg font-semibold">Meeting Attendees List</h3>
          <input
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search by name or alias..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-4 w-full overflow-x-auto">
        {/* Phim control all */}
        <div className="flex justify-end mb-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Mute All
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2">
            Disconnect All
          </button>
        </div>
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
              <th className="border border-gray-300 px-4 py-2 text-left flex justify-between">
                <span>Actions</span>
                {/* tạo 2 mũi tên lên xuống để soft */}
                <div>
                  <button onClick={() => handleSort("device")}>
                    <i
                      className={`fa-solid ${
                        sortOrder === "asc"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.map((attendee) => (
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
                      onClick={() => handleIndividualMicrophoneMuting(attendee)}
                      className={`rounded ${
                        attendee.is_muted === "YES"
                          ? "bg-gray-800 px-2 text-white"
                          : "bg-blue-500 px-3 text-white"
                      } hover:bg-blue-600`}
                      title={attendee.is_muted === "YES" ? "Unmute" : "Mute"}
                    >
                      <i
                        className={`fa-solid ${
                          attendee.is_muted === "YES"
                            ? "fa-microphone-slash"
                            : "fa-microphone"
                        }`}
                      ></i>
                    </button>

                    {/* Video Button */}
                    <button
                      onClick={() => handleIndividualVideoMuting(attendee)}
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

function simplifyDeviceName(vendor) {
  if (vendor.includes("Windows")) return "Windows";
  if (vendor.includes("Macintosh")) return "MacOS";
  if (vendor.includes("Android")) return "Android";
  if (vendor.includes("iPhone") || vendor.includes("iPad")) return "iOS";
  if (vendor.includes("Linux")) return "Linux";
  if (vendor.includes("Chrome")) return "Chrome Browser";
  if (vendor.includes("Firefox")) return "Firefox Browser";
  return vendor.split(" ")[0]; // Lấy phần đầu tiên của chuỗi nếu không khớp
}
