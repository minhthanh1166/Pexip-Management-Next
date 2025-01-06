import { toastNotify } from "@/app/helper";
import type { MeetingList } from "@/app/interfaces";
import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MeetingList({
  handleMeetingList,
  handleDisconnectAll,
  participants,
}) {
  const [meetingList, setMeetingList] = useState([]);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlias, setSelectedAlias] = useState<string>(""); // <-- Quản lý giá trị select
  const [meetingListPropUp, setMeetingListPropUp] = useState<boolean>(false);
  const { toggleMenu } = useToggleMenu();

  useEffect(() => {
    const fetchMeetingList = async () => {
      try {
        const response = await axios.get("/api/conference");
        if (response && response.data) {
          setMeetingList(response.data.objects);
          setLoading(false);
          return;
        }
      } catch (err) { }
    };
    fetchMeetingList();
  }, []);

  // Clear giá trị select khi participants trống
  useEffect(() => {
    if (!participants.length) {
      setSelectedAlias(""); // Đặt lại giá trị của select
    }
  }, [participants]);

  useEffect(() => {
    const fetchMeetingStatus = async () => {
      try {
        const response = await axios.get("/api/meeting_list");
        if (response && response.data) {
          setMeetingStatus(response.data.objects);
          setLoading(false);
          return;
        }
      } catch (err) { }
    };
    fetchMeetingStatus();
  }, []);
  
  return (
    <>
      {toggleMenu.isMeetingList && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Meeting List</h3>

          <div className="mb-6">
            {loading ? (
              <p className="text-center text-blue-600">Loading...</p>
            ) : (
              <>
                {meetingList &&
                  meetingList.map((item: MeetingList, index) => (
                    <div
                      className={`grid grid-cols-1 gap-2 cursor-pointer mb-2 shadow-lg hover:shadow-xl transition-shadow bg-gray-${item.aliases.some((j) => j.alias === selectedAlias) ? "200" : "100"} hover:bg-gray-200 rounded-lg`}
                      key={index}
                    >
                      <div className="flex items-center justify-between  rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {(item.name.length > 2
                                ? item.name.slice(0, 1) + item.name.slice(-1)
                                : item.name
                              ).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold">{item.name}</h5>
                            {meetingStatus &&
                              meetingStatus.map((status, index) => {
                                if (status.name !== item.name) return;
                                return (
                                  <div key={index}>
                                    <p className="text-xs text-gray-500">
                                      <span className="font-semibold">Status:</span>{" "}
                                      {status.is_started ? "Online" : "Offline"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      <span className="font-semibold">Status:</span>{" "}
                                      {status.is_locked ? "Locked" : "Unlocked"}
                                    </p>
                                  </div>
                                );
                              })}
                            <div className="overflow-x-scroll lg:w-[200px] w-[180px]">
                              <select
                                className="text-xs text-gray-500 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedAlias} // <-- liên kết với state
                                onChange={(e) => setSelectedAlias(e.target.value)}
                                onClick={() => {
                                  handleMeetingList(selectedAlias, item.pin);
                                }}>
                                <option value="">Select Alias</option>
                                {item.aliases.map((alias, index) => (
                                  <option key={index} value={alias.alias}>
                                    {alias.alias}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {participants.length > 0 && !item.aliases.some(j =>
                            participants.some(i => j.alias === i.local_alias)
                          ) ? (
                            <button
                              className="p-1 bg-green-500 hover:bg-green-600 rounded-md text-white text-xs shadow-sm"
                              onClick={() => setMeetingListPropUp(true)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          ) : null}

                          {participants.length > 0 && item.aliases.some(j =>
                            participants.some(i => j.alias === i.local_alias)
                          ) ? (
                            <button
                              onClick={handleDisconnectAll}
                              className="p-1 bg-red-500 hover:bg-red-600 rounded-md text-white text-xs shadow-sm"
                            >
                              <i className="fas fa-phone-slash"></i>
                            </button>
                          ) : null}

                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
      {/* Show Meeting Attendees List Prop up  */}
      {meetingListPropUp && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-[90%] max-w-[700px]">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Meeting Attendees Room: <span className="text-green-500">LabMeeting 2</span></h3>
              <button
                onClick={() => setMeetingListPropUp(false)}
                className="w-7 h-7 flex justify-center items-center bg-gray-500 text-white rounded-full hover:bg-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="overflow-x-auto">
              <>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-14 py-2 border-b text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-2 border-b text-sm font-semibold text-gray-700">Alias</th>
                      <th className="px-5 py-2 border-b text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-2 border-b text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-14 py-2 border-b text-sm text-gray-800">Nguyễn Kỳ Nam</td>
                      <td className="px-6 py-2 border-b text-sm text-gray-500">LabMeeting 2</td>
                      <td className="px-5 py-2 border-b text-sm text-gray-500">Guest</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-500">
                        <button
                          className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-xs shadow-sm"
                        >
                          {/* icon call */}
                          <i className="fas fa-phone me-2"></i>
                           Add to Meeting
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-14 py-2 border-b text-sm text-gray-800">Bùi Minh Thành</td>
                      <td className="px-6 py-2 border-b text-sm text-gray-500">LabMeeting 2</td>
                      <td className="px-5 py-2 border-b text-sm text-gray-500">Guest</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-500">
                        <button
                          className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white text-xs shadow-sm"
                        >
                          {/* icon call */}
                          <i className="fas fa-phone me-2"></i>
                           Add to Meeting
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            </div>
          </div>
        </div>

      )}

    </>
  );
}
