"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { toastNotify } from "@/app/helper";

declare global {
  interface Window {
    PexRTC: PexRTCType; // Define PexRTC to avoid TypeScript errors
  }
}

interface PexRTCType {
  new (): {
    onSetup: (stream: MediaStream, pinStatus: "none" | "required") => void;
    onConnect: (stream: MediaStream) => void;
    onDisconnect: (reason: string) => void;
    connect: (pin?: string) => void;
    disconnect: () => void;
    makeCall: (host: string, conference: string, name: string) => void;
  };
}

export default function CallConference() {
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const pexRTCInstance = useRef<ReturnType<typeof initializePexRTC> | null>(null);
  const farEndVideoRef = useRef<HTMLVideoElement>(null);
  const selfViewVideoRef = useRef<HTMLVideoElement>(null);

  // Function to initialize PexRTC
  const initializePexRTC = () => {
      const pexRTC = new window.PexRTC();

      // Define onSetup callback
      pexRTC.onSetup = (stream: MediaStream, pinStatus: "none" | "required") => {
        if (pinStatus === "none") {
          pexRTC.connect();
        } else {
          const pin = prompt("Please enter the PIN:") || undefined;
          if (pin) {
            pexRTC.connect(pin);
          } else {
            toastNotify("PIN is required to join the call.", "error");
          }
        }
        if (stream && selfViewVideoRef.current) {
          try {
            selfViewVideoRef.current.srcObject = stream;
          } catch (error) {
            console.error("Error setting local stream:", error);
          }
        }
      };

      // Define onConnect callback
      pexRTC.onConnect = (stream: MediaStream) => {
        if (stream instanceof MediaStream && farEndVideoRef.current) {
          try {
            farEndVideoRef.current.srcObject = stream;
          } catch (error) {
            console.error("Error setting remote stream:", error);
          }
        }
      };

      // Define onDisconnect callback
      pexRTC.onDisconnect = (reason: string) => {
        console.log("Call disconnected: ", reason);
        setInCall(false);
        if (farEndVideoRef.current) {
          farEndVideoRef.current.srcObject = null;
        }
      };

      return pexRTC;

  };

useEffect(() => {
  if (scriptLoaded) {
    pexRTCInstance.current = initializePexRTC();
  }

  return () => {
    if (pexRTCInstance.current) {
      pexRTCInstance.current.disconnect();
      pexRTCInstance.current = null;
    }
  };
}, [scriptLoaded]);

  // Toggle microphone mute
  const toggleMicMute = () => {
    setIsMicMuted((prev) => !prev);
    if (selfViewVideoRef.current?.srcObject instanceof MediaStream) {
      selfViewVideoRef.current.srcObject
        .getAudioTracks()
        .forEach((track) => (track.enabled = !isMicMuted));
    }
  };

  // Toggle video mute
  const toggleVidMute = () => {
    setIsVideoMuted((prev) => !prev);
    if (selfViewVideoRef.current?.srcObject instanceof MediaStream) {
      selfViewVideoRef.current.srcObject
        .getVideoTracks()
        .forEach((track) => (track.enabled = !isVideoMuted));
    }
  };

  // Toggle call (start/stop)
  const toggleCall = () => {
    const pexRTC = initializePexRTC();
    if (pexRTC) {
      if (!inCall) {
        console.log("Starting call...");
        pexRTC.makeCall("10.9.30.16", "LabMeeting", "User"); // Replace with actual host/conference/name
        setInCall(true);
      } else {
        console.log("Ending call...");
        pexRTC.disconnect();
        setInCall(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-full h-full">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      />
      <Script
        src="https://au.pexipdemo.com/static/webrtc/js/pexrtc.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("PexRTC script loaded successfully!");
          setScriptLoaded(true);
        }}
      />
      <div className="bg-white shadow-lg rounded-xl p-6 w-full h-full flex flex-col">
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
            onClick={toggleVidMute}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <i
              className={`fas ${isVideoMuted ? "fa-video-slash" : "fa-video"}`}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}
