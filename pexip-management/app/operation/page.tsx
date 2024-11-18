"use client";

import { useEffect, useState } from "react";
import {
  CallConference,
  ListMCUOperation,
  ListPeople,
  MeetingAttendeesList,
  Navbar,
  PlatformLiveView,
} from "./components";

const fetchToken = async () => {
  try {
    const response = await fetch(
      "https://10.9.30.16/api/client/v2/conferences/LabMeeting/request_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", pin: "54321" },
        body: JSON.stringify({
          display_name: "Administrator",
          role: "guest",
          vendor: "browser",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const { result } = await response.json();
    return { token: result.token, expires: result.expires };
  } catch (error) {
    console.error("Failed to fetch token:", error);
    throw error;
  }
};

export default function OperatorPage() {
  const [token, setToken] = useState<string | null>(null); // Token hiện tại
  const [expires, setExpires] = useState<number | null>(null); // Thời gian hết hạn

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const manageToken = async () => {
      try {
        const { token, expires } = await fetchToken();
        setToken(token);
        setExpires(expires);

        // Lưu token vào localStorage
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token);

        // Tính thời gian còn lại và đặt lịch làm mới token
        const refreshTime = (expires - 10) * 1000;
        refreshInterval = setInterval(async () => {
          try {
            const newTokenData = await fetchToken();
            setToken(newTokenData.token);
            setExpires(newTokenData.expires);

            // Cập nhật token vào localStorage
            localStorage.setItem("token", newTokenData.token);
          } catch (error) {
            console.error("Failed to refresh token:", error);
          }
        }, refreshTime);
      } catch (error) {
        console.error("Failed to manage token:", error);
      }
    };

    manageToken();

    return () => {
      clearInterval(refreshInterval); // Dọn dẹp interval khi component unmount
    };
  }, [!token]);

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
              <CallConference />
            </div>
            <div className="lg:w-1/3 lg:pl-2">
              <ListPeople />
            </div>
          </div>
          <div className="mt-2 lg:mt-0">
            <MeetingAttendeesList />
          </div>
        </div>

        {/* Right Column */}
        {/* <div className="flex-1 bg-red-500 p-4">Right Content</div> */}
      </div>
    </div>
  );
}
