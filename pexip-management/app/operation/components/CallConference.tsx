"use client";

import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";
import { useState } from "react";



export default function CallConferenceTest({
  selfViewVideoRef,
  farEndVideoRef,
  isMicMuted,
  isVideoMuted,
  inCall,
  toggleCall,
  toggleMicMute,
  toggleVideoMute,
  handleSendMessage,
}) {
  const [error, setError] = useState<any>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chat, setChat] = useState<string>("");
  const { toggleMenu, setToggleMenu } = useToggleMenu();

 // console.log("Test: " + toggleMenu.isMeetingList + " " + toggleMenu.isWorkerNodes + " " +  toggleMenu.isListPeople + " " +  toggleMenu.isMeetingAttendesslist)

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full h-full">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-4">Call Conference</h3>
          <button onClick={() => setToggleMenu((prev) => ({
            ...prev,
            toggle: !toggleMenu.toggle
          }))}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
        <div className="relative flex-grow bg-gray-900 rounded-lg overflow-hidden">
          <div className="w-full h-full">
            <video
              ref={farEndVideoRef}
              className="w-full lg:h-[500px] object-cover"
              autoPlay
              playsInline
            ></video>
          </div>
          <div className="absolute bottom-6 right-6 w-28 h-14 lg:w-36 lg:h-20 border border-gray-700 bg-black rounded-lg overflow-hidden">
            <video
              ref={selfViewVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            ></video>
          </div>
        </div>
        <div className="mt-2 flex justify-center gap-6">
          <button
            onClick={toggleCall}
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-md transition ${inCall
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            <i className={`fas ${inCall ? "fa-phone-slash" : "fa-phone"}`}></i>
          </button>
          <button
            onClick={toggleMicMute}
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i
              className={`fas ${isMicMuted ? "fa-microphone-slash" : "fa-microphone"
                }`}
            ></i>
          </button>
          <button
            onClick={toggleVideoMute}
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i
              className={`fas ${isVideoMuted ? "fa-video-slash" : "fa-video"}`}
            ></i>
          </button>
          {/* button chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i className="fas fa-comment"></i>
          </button>
        </div>
        {error && (
          <p className="mt-4 text-red-500 text-center">Error: {error}</p>
        )}
      </div>
      <div>
        {/* show dialog chat message top */}
        {showChat && (
          <div className="fixed top-0 lg:right-0 p-4 m-4 bg-gray-200 rounded-lg shadow-lg lg:w-full max-w-[400px] sm:max-w-[350px] lg:max-w-[300px]">
            <h3 className="text-lg font-semibold">Chat</h3>
            <div className="mt-2 overflow-auto">
              {/* Box show message */}
              <div className="flex gap-3 mb-4 h-[200px] p-3 bg-gray-100 rounded-lg overflow-y-auto">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {/* Thêm icon hoặc chữ cái đại diện cho người dùng */}
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>

                {/* Nội dung */}
                <div className="flex flex-col ml-3">
                  <h4 className="font-semibold text-base text-gray-800">
                    John Doe
                  </h4>
                  <p className="text-xs text-gray-600">Hello, how are you?</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {toggleMenu.toggle && (
          <div className="absolute top-0 lg:right-10 p-4 m-4 bg-gray-200 rounded-lg shadow-lg lg:w-full max-w-[400px] sm:max-w-[350px] lg:max-w-[300px]">
            <div className="flex flex-col gap-2">
              <button className="p-3 bg-white rounded-lg">
                Media tream
              </button>
              <span className="text-sm">Control:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm" id="metting-list">Metting list</label>
                  <input type="checkbox" id="metting-list" checked={toggleMenu.isMeetingList} onChange={(event) => setToggleMenu((prev) => ({...prev, isMeetingList: event.target.checked}))} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm" id="worker-nodes">Worker nodes</label>
                    <input type="checkbox" id="worker-nodes" checked={toggleMenu.isWorkerNodes} onChange={(event) => setToggleMenu((prev) => ({...prev, isWorkerNodes: event.target.checked}))}/>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm" id="list-people">List people</label>
                  <input type="checkbox" id="list-people" checked={toggleMenu.isListPeople} onChange={(event) => setToggleMenu((prev) => ({...prev, isListPeople: event.target.checked}))}/>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm" id="meeting-attendees-list">Meeting Attendees List</label>
                  <input type="checkbox" id="meeting-attendees-list" checked={toggleMenu.isMeetingAttendesslist} onChange={(event) => setToggleMenu((prev) => ({...prev, isMeetingAttendesslist: event.target.checked}))}/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
