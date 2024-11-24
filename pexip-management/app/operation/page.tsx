"use client";

import { useEffect, useRef, useState } from "react";
import {
  CallConference,
  ListPeople,
  MeetingAttendeesList,
  Navbar,
  PlatformLiveView,
} from "./components";
import { Participant } from "../interfaces";

interface State {
  display_name: string;
  node: string;
  conference_alias: string;
  pin?: string;
  isMicMuted?: boolean;
  isVideoMuted?: boolean;
  inCall?: boolean;
  error?: string;
  participants?: Participant[];
}

declare global {
  interface Window {
    PexRTC: any;
  }
}

export default function OperatorPage() {
  const pexRTC = useRef<any>(null);
  const selfViewVideoRef = useRef<any>(null);
  const farEndVideoRef = useRef<any>(null);

  const [state, setState] = useState<any>({
    display_name: "Administator",
    node: "10.9.30.16",
    conference_alias: "LabMeeting",
    pin: "54321",
    isMicMuted: false,
    isVideoMuted: false,
    inCall: false,
    error: null,
    participants: {},
  });

  const initializePexRTC = () => {
    console.log("Initializing PexRTC...");
    const pexRTCInstance = new window.PexRTC();

    // Set up callbacks
    pexRTCInstance.onSetup = (stream, pinStatus) => {
      console.log("PexRTC setup completed, pinStatus:", pinStatus);
      if (pinStatus === "none") {
        pexRTCInstance.connect();
      } else if (state.pin) {
        pexRTCInstance.connect(state.pin);
      } else {
        console.error("PIN is required to join the call.");
      }

      if (stream && selfViewVideoRef.current) {
        try {
          selfViewVideoRef.current.srcObject = stream;
        } catch (error) {
          console.error("Error setting local stream:", error);
        }
      }
    };

    pexRTCInstance.onConnect = (stream) => {
      console.log("PexRTC connected.");
      if (stream instanceof MediaStream && farEndVideoRef.current) {
        try {
          farEndVideoRef.current.srcObject = stream;
        } catch (error) {
          console.error("Error setting remote stream:", error);
        }
      }
      setState((prev) => ({ ...prev, inCall: true }));
    };

    pexRTCInstance.onDisconnect = (reason) => {
      console.log("PexRTC disconnected, reason:", reason);
      setState((prev) => ({ ...prev, inCall: false }));
      if (farEndVideoRef.current) {
        farEndVideoRef.current.srcObject = null;
      }
    };

    pexRTCInstance.onParticipantUpdate = (participant) => {
      console.log("Participant updated:", participant);
      setState((prev) => {
        const updatedParticipants = { ...prev.participants, [participant.uuid]: participant };
        console.log("Updated participants list:", Object.values(updatedParticipants));
        return { ...prev, participants: updatedParticipants };
      });
    };

    pexRTCInstance.onParticipantDelete = (participant) => {
      console.log("Participant deleted:", participant);
      setState((prev) => {
        const updatedParticipants = { ...prev.participants };
        delete updatedParticipants[participant.uuid];
        console.log("Updated participants list:", Object.values(updatedParticipants));
        return { ...prev, participants: updatedParticipants };
      });
    }

    return pexRTCInstance;
  };


  // Initialize and cleanup
  useEffect(() => {
    if (typeof window.PexRTC === "function") {
      pexRTC.current = initializePexRTC();
    } else {
      console.error("PexRTC library is not available.");
      setState((prev) => ({
        ...prev,
        error: "PexRTC library is not available.",
      }));
    }

    return () => {
      if (pexRTC.current) {
        console.log("Disconnecting PexRTC on unmount...");
        pexRTC.current.disconnect();
        pexRTC.current = null;
      }
    };
  }, [state.display_name, state.node, state.conference_alias, state.pin]);

  // Toggle microphone mute
  const toggleMicMute = () => {
    setState((prev) => {
      const isMicMuted = !prev.isMicMuted;
      if (selfViewVideoRef.current?.srcObject instanceof MediaStream) {
        selfViewVideoRef.current.srcObject
          .getAudioTracks()
          .forEach((track) => (track.enabled = !isMicMuted));
      }
      return { ...prev, isMicMuted };
    });
  };

  // Toggle video mute
  const toggleVideoMute = () => {
    setState((prev) => {
      const isVideoMuted = !prev.isVideoMuted;
      if (selfViewVideoRef.current?.srcObject instanceof MediaStream) {
        selfViewVideoRef.current.srcObject
          .getVideoTracks()
          .forEach((track) => (track.enabled = !isVideoMuted));
      }
      return { ...prev, isVideoMuted };
    });
  };

  // Toggle call (start/stop)
  const toggleCall = () => {
    if (!pexRTC.current) {
      console.error("PexRTC is not initialized.");
      return;
    }

    if (!state.inCall) {
      console.log("Starting call...");
      pexRTC.current.makeCall(
        state.node,
        state.conference_alias,
        state.display_name
      );
      setState((prev) => ({ ...prev, inCall: true }));
    } else {
      console.log("Ending call...");
      pexRTC.current.disconnect();
      setState((prev) => ({ ...prev, inCall: false, participants: [] }));
    }
  };

  const handleIndividualMicrophoneMuting = (participant: Participant) => {
    console.log("Muting microphone for participant:", participant);
  }

  const handleIndividualVideoMuting = (participant: Participant) => {
    console.log("Muting video for participant:", participant);
  }

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 flex flex-col md:flex-row gap-2 p-3">
        {/* Left Column */}
        <div className="flex-1">
          <PlatformLiveView />
        </div>
        {/* Center Column */}
        <div className="flex-[3] h-full">
          <div className="lg:flex mb-2">
            <div className="lg:w-2/3 mb-2 lg:mb-0">
              <CallConference
                selfViewVideoRef={selfViewVideoRef}
                farEndVideoRef={farEndVideoRef}
                isMicMuted={state.isMicMuted}
                isVideoMuted={state.isVideoMuted}
                inCall={state.inCall}
                toggleMicMute={toggleMicMute}
                toggleVideoMute={toggleVideoMute}
                toggleCall={toggleCall}
              />
            </div>
            <div className="lg:w-1/3 lg:pl-2">
              <ListPeople />
            </div>
          </div>
          <div className="mt-2 lg:mt-0">
            <MeetingAttendeesList
              participants={state.participants}
              handleIndividualMicrophoneMuting={handleIndividualMicrophoneMuting}
              handleIndividualVideoMuting={handleIndividualVideoMuting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
