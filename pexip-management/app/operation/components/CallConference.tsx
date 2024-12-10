"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import "@/app/operation/styles/conference.css";
import { useToggleMenu } from "@/app/useContext/toggleMenuProvider";

type VideoProps = {
  className?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  onClick?: (event: any) => void;
  mediaStream?: MediaStream;
};

const Video = (props: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Set media stream only when it's changed
  useEffect(() => {
    if (videoRef.current && props.mediaStream) {
      videoRef.current.srcObject = props.mediaStream;
    }
  }, [props.mediaStream]);

  return (
    <video
      ref={videoRef}
      className={props.className}
      autoPlay
      playsInline
      muted={props.muted}
      onClick={props.onClick}
    />
  );
};

export default function CallConferenceTest({
  localStream,
  remoteStream,
  presentationStream,
  toggleCall,
  toggleMicMute,
  toggleVideoMute,
  handleSendMessage,
  handleScreenShare,
  isMicMuted,
  isVideoMuted,
  inCall,
  selfViewVideoRef,
  farEndVideoRef,
}) {
  const [presentationInMain, setPresentationInMain] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chat, setChat] = useState<string>("");
  const { toggleMenu, setToggleMenu } = useToggleMenu();

  // Tối ưu hóa việc chuyển video chính
  const switchVideos = useCallback((event) => {
    if (event.target.classList.contains("presentation-video")) {
      setPresentationInMain(true); // Hiển thị presentation video chính
    } else {
      setPresentationInMain(false); // Hiển thị remote stream chính
    }
  }, []);


  return (
    <div className="relative w-full h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full h-full">
        {/* Header */}
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-4">Call Conference</h3>
          <button onClick={() => setToggleMenu((prev) => ({
            ...prev,
            toggle: !toggleMenu.toggle
          }))}>
            <i className="fa fa-bars"></i>
          </button>
        </div>

        {/* Video Conference */}
        <div className="relative flex-grow bg-gray-900 rounded-lg overflow-hidden">
          <div className={`Conference w-full h-full relative flex aspect-video`}>
            {presentationInMain ? (
              <Video
                mediaStream={presentationStream}
                className="w-full h-full rounded-lg object-contain bg-black cursor-pointer"
                onClick={switchVideos}
              />
            ) : (
              <>
                <Video
                  mediaStream={remoteStream}
                  className="w-full h-full rounded-lg object-contain bg-black"
                  onClick={switchVideos}
                />
                {localStream && (
                  <Video
                    mediaStream={localStream}
                    className="absolute w-1/4 bottom-4 right-4 rounded-lg aspect-video object-cover z-10"
                    muted
                  />
                )}
                {presentationStream && (
                  <Video
                    className="absolute w-1/4 top-4 left-4 rounded-lg m-4 aspect-video object-cover cursor-pointer z-10 presentation-video"
                    mediaStream={presentationStream}
                    onClick={switchVideos}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Call Controls */}
        <div className="mt-4 flex justify-center gap-6">
          <button
            onClick={toggleCall}
            className={`w-10 h-10 rounded-full shadow-md transition ${inCall
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            <i className={`fas ${inCall ? "fa-phone-slash" : "fa-phone"}`}></i>
          </button>
          <button
            onClick={toggleMicMute}
            className="w-10 h-10 rounded-full shadow-md bg-gray-800 hover:bg-gray-700 text-white"
          >
            <i className={`fas ${isMicMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
          </button>
          <button
            onClick={toggleVideoMute}
            className="w-10 h-10 rounded-full shadow-md bg-gray-800 hover:bg-gray-700 text-white"
          >
            <i className={`fas ${isVideoMuted ? "fa-video-slash" : "fa-video"}`}></i>
          </button>
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="w-10 h-10 rounded-full shadow-md bg-gray-800 hover:bg-gray-700 text-white"
          >
            <i className="fas fa-comment"></i>
          </button>
          <button
            onClick={handleScreenShare}
            className="w-10 h-10 rounded-full shadow-md bg-gray-800 hover:bg-gray-700 text-white"
          >
            <i className="fas fa-desktop"></i>
          </button>
        </div>
      </div>

      {/* Chat Box */}
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
