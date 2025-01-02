import { OverlayRecognition } from './overlay_recognition'

export interface Detection {
    "visual_result_path": string,
    "elements": OverlayRecognition[]
}