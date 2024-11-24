export default interface Participant {
    api_url: string;                          // URL của participant
    buzz_time: number;                        // Thời gian buzz
    call_direction: "in" | "out";             // Hướng cuộc gọi ("in" cho cuộc gọi đến, "out" cho cuộc gọi đi)
    call_tag: string;                         // Tag của cuộc gọi
    disconnect_supported: "YES" | "NO";       // Hỗ trợ ngắt kết nối
    display_name: string;                     // Tên hiển thị của participant
    encryption: "On" | "Off";                 // Trạng thái mã hóa
    external_node_uuid: string;               // UUID của node bên ngoài (nếu có)
    fecc_supported: "YES" | "NO";             // Hỗ trợ FECC (Remote Control)
    has_media: boolean;                       // Có dữ liệu media
    is_audio_only_call: "YES" | "NO";         // Cuộc gọi chỉ có âm thanh hay không
    is_conjoined: boolean;                    // Có phải là cuộc gọi conjoined (nối tiếp)?
    is_external: boolean;                     // Có phải là cuộc gọi từ bên ngoài không
    is_idp_authenticated: boolean;            // Có xác thực qua IDP hay không
    is_main_video_dropped_out: boolean;       // Video chính có bị mất hay không
    is_muted: "YES" | "NO";                   // Trạng thái mute
    is_presenting: "YES" | "NO";              // Có đang chia sẻ màn hình không
    is_streaming_conference: boolean;         // Có phải là cuộc gọi streaming conference không
    is_video_call: "YES" | "NO";              // Là cuộc gọi video hay không
    is_video_muted: boolean;                  // Trạng thái video mute
    is_video_silent: boolean;                 // Trạng thái video silent
    layout_group: string | null;               // Layout group của participant
    local_alias: string;                      // Alias nội bộ
    mute_supported: "YES" | "NO";             // Hỗ trợ mute
    needs_presentation_in_mix: boolean;       // Có cần trình bày trong mix không
    overlay_text: string;                     // Text hiển thị trên overlay
    presentation_supported: "YES" | "NO";     // Hỗ trợ chia sẻ màn hình
    protocol: string;                         // Giao thức (ví dụ: webrtc)
    receive_from_audio_mix: string;           // Nhận từ audio mix chính hay phụ
    role: "chair" | "participant" | string;   // Vai trò trong cuộc gọi
    rx_presentation_policy: "ALLOW" | "DENY"; // Chính sách nhận chia sẻ màn hình
    send_to_audio_mixes: any[];               // Danh sách các audio mixes để gửi
    service_type: "conference" | string;      // Loại dịch vụ (conference, v.v.)
    show_live_captions: boolean;              // Hiển thị live captions
    spotlight: number;                        // Spotlight (trạng thái spotlight của participant)
    start_time: number;                       // Thời gian bắt đầu cuộc gọi
    transfer_supported: "YES" | "NO";         // Hỗ trợ chuyển cuộc gọi
    uri: string;                              // URI của participant
    uuid: string;                             // UUID của participant
    vendor: string;                           // Nhà cung cấp dịch vụ
  }
  