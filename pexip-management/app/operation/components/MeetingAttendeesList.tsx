"use client";

import { useEffect, useState } from "react";
import { Participant } from "@/app/interfaces";
import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";

type MeetingAttendeesListProps = {
  participants: Participant[];
  handleIndividualMicrophoneMuting: (participant: Participant) => void;
  handleIndividualVideoMuting: (participant: Participant) => void;
  handleIndividualDisconnect: (participant: Participant) => void;
  handleMuteMicrophonesAll: () => void;
  handleMuteCameraAll: () => void;
  handleAutoMuteMic: (event) => void;
  handleAutoMuteCamera: (event) => void;
};

export default function MeetingAttendeesList({
  participants,
  handleIndividualVideoMuting,
  handleIndividualMicrophoneMuting,
  handleIndividualDisconnect,
  handleMuteMicrophonesAll,
  handleMuteCameraAll,
  handleAutoMuteMic,
  handleAutoMuteCamera,
}: MeetingAttendeesListProps) {
  const [attendees, setAttendees] = useState<any[]>([]); // Dữ liệu người tham gia
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi khi fetch dữ liệu
  const [searchQuery, setSearchQuery] = useState(""); // Truy vấn tìm kiếm
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("device");
  const [disconnect, setDisconnect] = useState(false);
  const { toggleMenu } = useToggleMenu();

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
    <>
    {toggleMenu.isMeetingAttendesslist && (
         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
         {/* Header */}
         <div className="border-b border-gray-300 p-4">
           <div className="flex justify-between pt-2">
             <h3 className="text-lg font-semibold">Meeting Attendees List</h3>
             <div className="lg:flex">
               <div className="flex items-center">
                 {/* input auto mute mic check box  */}
                 <div>
                   <label className="mr-2">Auto Mute Mic</label>
                   <input
                     type="checkbox"
                     onChange={(event) =>
                       handleAutoMuteMic(
                         (event.target as HTMLInputElement).checked
                       )
                     }
                     className="mr-2"
                   />
                 </div>
                 <div>
                   <label className="mr-2">Auto Mute Camera</label>
                   <input
                     type="checkbox"
                     onChange={(event) =>
                       handleAutoMuteCamera(
                         (event.target as HTMLInputElement).checked
                       )
                     }
                     className="mr-2"
                   />
                 </div>
               </div>
               <input
                 className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 type="text"
                 placeholder="Search by name or alias..."
               />
             </div>
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
                 <th className="border border-gray-300 px-4 py-2 text-left">
                   Notification
                 </th>
                 <th className="border  border-gray-300 px-4 py-2 text-left flex justify-between">
                   <span>Actions</span>
                   {/* tạo 2 mũi tên lên xuống để soft */}
                   <div className="flex gap-2">
                     {/* Button Mute Mic All */}
                     <button onClick={handleMuteMicrophonesAll}>
                       <i className="fa-solid fa-microphone-slash"></i>
                     </button>
   
                     {/* Button Mute Camera All */}
                     <button onClick={handleMuteCameraAll}>
                       <i className="fa-solid fa-video-slash"></i>
                     </button>
   
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
                     {/* button show */}
                     <button
                       className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                       title="Show Notification"
                     >
                       <i className="fa-solid fa-bell"></i>
                     </button>
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
   
                       {/* Button dơ tay */}
                       {/* {attendee.display_name !== "Administator" && (
                         <button
                         className="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-600"
                         title="Raise Hand"
                         onClick={() => handleIndividualRaise(attendee)}
                       >
                         <i className="fa-solid fa-hand-paper"></i>
                       </button>
                       )} */}
                       {/* <button
                         className="bg-yellow-500 text-white px-2 rounded hover:bg-yellow-600"
                         title="Raise Hand"
                         onClick={() => handleIndividualRaise(attendee)}
                       >
                         <i className="fa-solid fa-hand-paper"></i>
                       </button> */}
   
                       {/* Share content*/}
   
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
    )}
    </>
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
