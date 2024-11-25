"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { toastNotify } from "@/app/helper/index";
import { Participant } from "@/app/interfaces";

type MeetingAttendeesListProps = {
  participants: Participant[];
  handleIndividualMicrophoneMuting: (participant: Participant) => void;
  handleIndividualVideoMuting: (participant: Participant) => void;
  handleIndividualDisconnect: (participant: Participant) => void;
};

export default function MeetingAttendeesList({
  participants,
  handleIndividualVideoMuting,
  handleIndividualMicrophoneMuting,
  handleIndividualDisconnect
}: MeetingAttendeesListProps) {
  const [attendees, setAttendees] = useState([]); // Dữ liệu người tham gia
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi khi fetch dữ liệu
  const [searchQuery, setSearchQuery] = useState(""); // Truy vấn tìm kiếm
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("device");
  const [disconnect, setDisconnect] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        console.log("Fetching attendees...: ", participants);
        const mappedAttendees = participants.map(
          (participant: Participant) => ({
            ...participant,
            device: simplifyDeviceName(participant.vendor || "Unknown Device"),
          })
        );
        setAttendees(mappedAttendees); // Cập nhật attendees
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setError("Failed to fetch attendees data.");
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [participants]);

  const handleSort = (field: string) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortField(field);

    const sorted = [...attendees].sort((a, b) => {
      const fieldA = a[field] || "";
      const fieldB = b[field] || "";

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return order === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        return order === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0; // Giữ nguyên thứ tự nếu kiểu dữ liệu không hợp lệ
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
                  <button onClick={() => handleSort("is_muted")}>
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

                    {/* Disconnect Button */}
                    <button
                      className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                      title="Disconnect"
                      onClick={() => handleIndividualDisconnect(attendee)}
                    >
                      <i className="fa-solid fa-phone-slash"></i>
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
