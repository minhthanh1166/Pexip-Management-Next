import type { MeetingList } from "@/app/interfaces";
import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MeetingList({
  handleMeetingList,
  handleDisconnectAll,
}) {
  const [meetingList, setMeetingList] = useState([]);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlias, setSelectedAlias] = useState<string>("");
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
    // call set time 10 seconds
    fetchMeetingList();
  }, [meetingList]);

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
  }, [meetingStatus]);

  return (
    <>
      {toggleMenu.isMeetingList && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Meeting List</h3>

          {/* Danh sách worker nodes */}
          <div className="mb-6">
            {loading ? (
              <>
                <p className="text-center text-blue-600">Loading...</p>
              </>
            ) : (
              <>
                {meetingList &&
                  meetingList.map((item: MeetingList, index) => (
                    <div
                      className="grid grid-cols-1 gap-2 cursor-pointer mb-2"
                      key={index}
                      onClick={() =>
                        handleMeetingList(selectedAlias, item.pin)
                      }
                    >
                      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            {/* Thêm icon hoặc chữ cái đại diện cho người dùng */}
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
                            {/* Form select alias */}
                            <div className="overflow-x-scroll lg:w-[200px] w-[180px]">
                              <select className="text-xs text-gray-500" onChange={
                                (e) => setSelectedAlias(e.target.value)
                              }>
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
                        <button onClick={handleDisconnectAll}>
                          {/* button disconnect all */}
                          <i className="fas fa-phone-slash text-red-500 me-2"></i>
                        </button>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
