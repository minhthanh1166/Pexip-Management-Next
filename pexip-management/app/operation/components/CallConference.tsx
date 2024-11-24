"use client";

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
}) {
  const [error, setError] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full h-full">
        <h3 className="text-lg font-semibold mb-4">Call Conference</h3>
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
            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-md transition ${
              inCall
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <i className={`fas ${inCall ? "fa-phone-slash" : "fa-phone"}`}></i>
          </button>
          <button
            onClick={toggleMicMute}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i
              className={`fas ${
                isMicMuted ? "fa-microphone-slash" : "fa-microphone"
              }`}
            ></i>
          </button>
          <button
            onClick={toggleVideoMute}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i
              className={`fas ${
                isVideoMuted ? "fa-video-slash" : "fa-video"
              }`}
            ></i>
          </button>
        </div>
      {error && <p className="mt-4 text-red-500 text-center">Error: {error}</p>}
    </div>
  );
}
