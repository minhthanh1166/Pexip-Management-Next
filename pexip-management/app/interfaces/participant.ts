export default interface Participant {
  api_url: string
  buzz_time: number
  call_direction: string
  call_tag: string
  disconnect_supported: string
  display_name: string
  encryption: string
  external_node_uuid: string
  fecc_supported: string
  has_media: boolean
  is_audio_only_call: string
  is_conjoined: boolean
  is_external: boolean
  is_idp_authenticated: boolean
  is_main_video_dropped_out: boolean
  is_muted: string
  is_presenting: string
  is_streaming_conference: boolean
  is_video_call: string
  is_video_muted: boolean
  is_video_silent: boolean
  layout_group: any
  local_alias: string
  mute_supported: string
  needs_presentation_in_mix: boolean
  overlay_text: string
  presentation_supported: string
  protocol: string
  receive_from_audio_mix: string
  role: string
  rx_presentation_policy: string
  send_to_audio_mixes: any[]
  service_type: string
  show_live_captions: boolean
  spotlight: number
  start_time: number
  transfer_supported: string
  uri: string
  uuid: string
  vendor: string
  }
  

  // api_url: string
  // buzz_time: number
  // call_direction: string
  // call_tag: string
  // disconnect_supported: string
  // display_name: string
  // encryption: string
  // external_node_uuid: string
  // fecc_supported: string
  // has_media: boolean
  // is_audio_only_call: string
  // is_conjoined: boolean
  // is_external: boolean
  // is_idp_authenticated: boolean
  // is_main_video_dropped_out: boolean
  // is_muted: string
  // is_presenting: string
  // is_streaming_conference: boolean
  // is_video_call: string
  // is_video_muted: boolean
  // is_video_silent: boolean
  // layout_group: any
  // local_alias: string
  // mute_supported: string
  // needs_presentation_in_mix: boolean
  // overlay_text: string
  // presentation_supported: string
  // protocol: string
  // receive_from_audio_mix: string
  // role: string
  // rx_presentation_policy: string
  // send_to_audio_mixes: any[]
  // service_type: string
  // show_live_captions: boolean
  // spotlight: number
  // start_time: number
  // transfer_supported: string
  // uri: string
  // uuid: string
  // vendor: string