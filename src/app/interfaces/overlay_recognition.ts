export interface OverlayRecognition {
    id?: string,
    "guid": string,
    "class_id": number,
    "confidence": number,
    "bbox_xyxy_abs": number[],
    "text": string
}