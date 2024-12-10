"use client";

import { useEffect, useRef, useState } from "react";
import {
  CallConference,
  ListPeople,
  MeetingAttendeesList,
  MeetingList,
  Navbar,
  PlatformLiveView,
} from "./components";
import { Participant } from "../interfaces";
import { toastNotify } from "../helper";
import { useToggleMenu } from "../useContext/toggleMenuProvider";


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
  isAutoMuteMic?: boolean;
  isAutoMuteCamera?: boolean;
}

declare global {
  interface Window {
    PexRTC: any;
    PexRTMP: any;
  }
}


export default function OperatorPage() {
  const pexRTC = useRef<any>(null);
  const selfViewVideoRef = useRef<any>(null);
  const farEndVideoRef = useRef<any>(null);

  const [state, setState] = useState<State>({
    display_name: "Administator",
    node: "10.9.30.16",
    conference_alias: "",
    pin: "",
    isMicMuted: false,
    isVideoMuted: false,
    inCall: false,
    error: null,
    participants: [],
    isAutoMuteMic: false,
    isAutoMuteCamera: false,
  });

  const [screenShared, setScreenShared] = useState<boolean>(false);
  const [presentationStream, setPresentationStream] = useState<boolean>();
  const [presentationInMain, setPresentationInMain] = useState<any>();
  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();

  const { toggleMenu } = useToggleMenu();

  const initializePexRTC = () => {
    const pexRTCInstance = new window.PexRTC();

    // Set up callbacks
    pexRTCInstance.onSetup = (stream, pinStatus) => {
      if (pinStatus === "none") {
        pexRTCInstance.connect();
      } else if (state.pin) {
        pexRTCInstance.connect(state.pin);
      } else {
        toastNotify("PIN is required to join the call.", "error");
      }

      if (stream && selfViewVideoRef.current) {
        try {
          selfViewVideoRef.current.srcObject = stream;
          setLocalStream(stream);
        } catch (error) {
          toastNotify(`Error setting local stream: ${error}`, "error");
        }
      }
    };

    pexRTCInstance.onConnect = (stream) => {
      if (stream instanceof MediaStream && farEndVideoRef.current) {
        try {
          farEndVideoRef.current.srcObject = stream;
        } catch (error) {
          toastNotify(`Error setting remote stream: ${error}`, "error");
        }
      }
      setState((prev) => ({ ...prev, inCall: true }));
      setRemoteStream(stream);
    };

    pexRTCInstance.onDisconnect = (reason) => {
      toastNotify(`PexRTC disconnected, reason: ${reason}`, "info");
      setState((prev) => ({ ...prev, inCall: false }));
      if (farEndVideoRef.current) {
        farEndVideoRef.current.srcObject = null;
      }
    };

    // pexRTCInstance.onParticipantUpdate = (participant) => {
    //   console.log("Participant updated:", participant);
    //   setState((prev) => {
    //     const updatedParticipants = { ...prev.participants, [participant.uuid]: participant };
    //     console.log("Updated participants list:", Object.values(updatedParticipants));
    //     return { ...prev, participants: updatedParticipants };
    //   });
    // };

    // pexRTCInstance.onParticipantDelete = (participant) => {
    //   console.log("Participant deleted:", participant);
    //   setState((prev) => {
    //     const updatedParticipants = { ...prev.participants };
    //     delete updatedParticipants[participant.uuid];
    //     console.log("Updated participants list:", Object.values(updatedParticipants));
    //     return { ...prev, participants: updatedParticipants };
    //   });
    // }

    pexRTCInstance.onParticipantUpdate = (participant) => {
      setState((prev) => {
        const updatedParticipants = prev.participants.map((p) =>
          p.uuid === participant.uuid ? participant : p
        );
        // Nếu không tìm thấy participant, thêm mới
        if (!updatedParticipants.some((p) => p.uuid === participant.uuid)) {
          updatedParticipants.push(participant);
        }
        console.log("Updated participants list:", updatedParticipants);
        return { ...prev, participants: updatedParticipants };
      });
    };

    pexRTCInstance.onParticipantDelete = (participant) => {
      setState((prev) => {
        const updatedParticipants = prev.participants.filter(
          (p) => p.uuid !== participant.uuid
        );
        console.log("Updated participants list:", updatedParticipants);
        return { ...prev, participants: updatedParticipants };
      });
    };

    pexRTCInstance.onScreenshareConnected = (stream) => {
      setPresentationStream(stream);
    }

    pexRTCInstance.onScreenshareStopped = (reason) => {
      setPresentationStream(null);
    }

    pexRTCInstance.PexRTCStatistics = (state) => {
      console.log("PexRTC state:", state);
    }

    console.log("PexRTC media devices:", pexRTCInstance.getMediaStatistics());


    return pexRTCInstance;
  };

  // Initialize and cleanup
  useEffect(() => {
    if (typeof window.PexRTC === "function") {
      pexRTC.current = initializePexRTC();
    } else {
      toastNotify("PexRTC library is not available.", "error");
      setState((prev) => ({
        ...prev,
        error: "PexRTC library is not available.",
      }));
    }

    return () => {
      if (pexRTC.current) {
        pexRTC.current.disconnect();
        pexRTC.current = null;
      }
    };
  }, [state.display_name, state.node, state.conference_alias, state.pin]);

  useEffect(() => {
    if (!pexRTC.current || !state.isAutoMuteMic) return;

    // mute all microphones
    state.participants.forEach((participant) => {
      if (participant.is_muted === "NO") {
        pexRTC.current.setParticipantMute(participant.uuid, "YES");
        toastNotify("Muted all microphones successfully.", "success");
      }
    });
  }, [state.participants, state.isAutoMuteMic]);

  useEffect(() => {
    if (!pexRTC.current || !state.isAutoMuteCamera) return;

    // mute all microphones
    state.participants.forEach((participant) => {
      if (participant.is_video_muted === false) {
        pexRTC.current.videoMuted(participant.uuid);
        toastNotify("Muted all cameras successfully.", "success");
      }
    });
  }, [state.participants, state.isAutoMuteCamera]);

  // Toggle microphone mute
  const toggleMicMute = () => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }

    if (state.participants.length > 0) {
      const muted = pexRTC.current.muteAudio(!state.isMicMuted);
      setState((prev) => {
        return { ...prev, isMicMuted: muted };
      });

      setState((prev: any) => {
        const updatedParticipants = prev.participants.map((p) =>
          p.uuid === pexRTC.current.uuid ? { ...p, is_muted: muted === "YES" ? true : false } : p
        );
        return { ...prev, participants: updatedParticipants };
      });
    }
  };

  // Toggle video mute
  const toggleVideoMute = () => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }


    const muted = pexRTC.current.muteVideo(!state.isVideoMuted);
    setState((prev) => {
      return { ...prev, isVideoMuted: muted };
    });
  };

  // Toggle call (start/stop)
  const toggleCall = () => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    if (state.conference_alias === "") {
      toastNotify("Please enter the conference alias.", "error");
      return
    }

    if (!state.inCall) {
      pexRTC.current.makeCall(
        state.node,
        state.conference_alias,
        state.display_name
      );
      setState((prev) => ({ ...prev, inCall: true }));
    } else {
      pexRTC.current.disconnect();
      setState((prev) => ({ ...prev, inCall: false, participants: [] }));
    }
  };

  const handleIndividualMicrophoneMuting = (participant: Participant) => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    const isMuted = participant.is_muted === "YES";
    pexRTC.current.setParticipantMute(participant.uuid, !isMuted);
    console.log(
      `${isMuted ? "Unmuting" : "Muting"} microphone for participant:`,
      participant.display_name
    );

    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.uuid === participant.uuid
          ? { ...p, is_muted: isMuted ? "NO" : "YES" }
          : p
      ),
    }));
  };

  const handleIndividualVideoMuting = (participant: Participant) => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }

    const isVideoMuted = participant.is_video_muted;
    if (isVideoMuted) {
      pexRTC.current.videoUnmuted(participant.uuid);
    } else {
      pexRTC.current.videoMuted(participant.uuid);
    }
    console.log(
      `${isVideoMuted ? "Unmuting" : "Muting"} video for participant:`,
      participant.display_name
    );

    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.uuid === participant.uuid
          ? { ...p, is_video_muted: !isVideoMuted }
          : p
      ),
    }));
  };

  const handleIndividualDisconnect = (participant: Participant) => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    pexRTC.current.disconnectParticipant(participant.uuid);

    setState((prev) => ({
      ...prev,
      participants: prev.participants.filter(
        (p) => p.uuid !== participant.uuid
      ),
    }));
  };

  const handleMuteMicrophonesAll = () => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return
    }

    const action = window.confirm(
      "Are you sure you want to toggle all microphones?"
    )
      ? "mute"
      : "unmute";

    if (!state.participants || state.participants.length === 0) {
      toastNotify("Participants list is empty.", "error");
      return;
    }

    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    state.participants.forEach((participant) => {
      if (participant.mute_supported === "YES") {
        const shouldMute = action === "mute" && participant.is_muted === "NO";
        const shouldUnmute =
          action === "unmute" && participant.is_muted === "YES";

        if (shouldMute || shouldUnmute) {
          pexRTC.current.setParticipantMute(participant.uuid, shouldMute);
          console.log(
            `${shouldMute ? "Muted" : "Unmuted"} microphone for participant: ${participant.display_name
            }`
          );
        }
      }
    });

    // Cập nhật trạng thái trong state
    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.mute_supported === "YES"
          ? { ...p, is_muted: action === "mute" ? "YES" : "NO" }
          : p
      ),
    }));

    toastNotify(
      `${action === "mute" ? "Muted" : "Unmuted"
      } all microphones successfully.`,
      "success"
    );
  };

  const handleMuteCameraAll = () => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }


    const action = window.confirm(
      "Are you sure you want to toggle all cameras?"
    )
      ? "mute"
      : "unmute";

    if (!state.participants || state.participants.length === 0) {
      toastNotify("Participants list is empty.", "error");
      return;
    }

    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    state.participants.forEach((participant) => {
      if (participant.is_video_call === "YES" && participant.has_media) {
        const shouldMute = action === "mute" && !participant.is_video_muted;
        const shouldUnmute = action === "unmute" && participant.is_video_muted;

        if (shouldMute) {
          pexRTC.current.videoMuted(participant.uuid);
        } else if (shouldUnmute) {
          pexRTC.current.videoUnmuted(participant.uuid);
        }
      }
    });

    // Cập nhật trạng thái video muted trong state
    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.is_video_call === "YES" && p.has_media
          ? { ...p, is_video_muted: action === "mute" }
          : p
      ),
    }));

    toastNotify(
      `${action === "mute" ? "Muted" : "Unmuted"} all cameras successfully.`,
      "success"
    );
  };

  const handleAutoMuteMic = (event) => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }


    setState((prev) => {
      return {
        ...prev,
        isAutoMuteMic: event,
      };
    });
  };

  const handleAutoMuteCamera = (event) => {
    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }

    setState((prev) => {
      return {
        ...prev,
        isAutoMuteCamera: event,
      };
    });
  };

  const handleSendMessage = () => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }

    // send message
  };

  const handleMeetingList = (name: string, pin: string) => {
    setState((prev) => ({
      ...prev,
      conference_alias: name,
      pin: pin,
    }));
  };

  const handleDisconnectAll = () => {
    // ask for confirmation
    const confirm = window.confirm("Are you sure you want to disconnect all?");
    if (!confirm) return;

    if (state.participants.length === 0) {
      toastNotify("Participants list is empty.", "error");
      return;
    }

    // disconnect all participants
    if (pexRTC.current) {
      pexRTC.current.disconnectAll();
      // clear participants list
      setState((prev) => ({ ...prev, participants: [] }));
    }
  };

  useEffect(() => {
    if (!presentationStream) {
      if (presentationInMain != null) setPresentationInMain(null);
    } else {
      if (presentationInMain == null) {
        setPresentationInMain(true);
      }
    }
  }, [
    presentationInMain,
    presentationStream
  ])

  const handleScreenShare = () => {
    if (!pexRTC.current) {
      toastNotify("PexRTC is not initialized.", "error");
      return;
    }

    if (state.inCall === false) {
      toastNotify("Please start the call first.", "error");
      return;
    }

    if (screenShared) {
      pexRTC.current.present(null);
    } else {
      pexRTC.current.present('screen');
    }

    setScreenShared(!screenShared);
  }

  return (

    <div>
      <div className="bg-gray-100 flex flex-col md:flex-row gap-2 p-3">
        {/* Left Column */}
        <div className={`${toggleMenu.isWorkerNodes ? 'flex-1' : toggleMenu.isMeetingList ? 'flex-1' : null}`}>
          <div className="mb-2">
            <MeetingList
              handleMeetingList={handleMeetingList}
              handleDisconnectAll={handleDisconnectAll}
              // truyền vào state để hiển thị thông tin
              participants={state.participants}
            />
          </div>
          <PlatformLiveView />
        </div>
        {/* Center Column */}
        <div className="flex-[3] h-full">
          <div className={`${toggleMenu.isListPeople ? 'lg:flex' : null} mb-2`}>
            <div className={`${toggleMenu.isListPeople ? 'lg:w-2/3' : null}  mb-2 lg:mb-0`}>
              <CallConference
                handleScreenShare={handleScreenShare}
                selfViewVideoRef={selfViewVideoRef}
                farEndVideoRef={farEndVideoRef}
                isMicMuted={state.isMicMuted}
                isVideoMuted={state.isVideoMuted}
                inCall={state.inCall}
                toggleMicMute={toggleMicMute}
                toggleVideoMute={toggleVideoMute}
                toggleCall={toggleCall}
                handleSendMessage={handleSendMessage}
                localStream={localStream}
                presentationStream={presentationStream}
                remoteStream={remoteStream}
              />
            </div>
            <div className="lg:w-1/3 lg:pl-2">
              <ListPeople />
            </div>
          </div>
          <div className="mt-2 lg:mt-0">
            <MeetingAttendeesList
              participants={state.participants}
              handleIndividualMicrophoneMuting={
                handleIndividualMicrophoneMuting
              }
              handleIndividualVideoMuting={handleIndividualVideoMuting}
              handleIndividualDisconnect={handleIndividualDisconnect}
              handleMuteMicrophonesAll={handleMuteMicrophonesAll}
              handleMuteCameraAll={handleMuteCameraAll}
              handleAutoMuteMic={handleAutoMuteMic}
              handleAutoMuteCamera={handleAutoMuteCamera}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
