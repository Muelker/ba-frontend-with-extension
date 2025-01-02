import { Detection } from "./detection"

export interface Results {
    project_id: number,
    image_id: number,
    ai_model_id: number,
    text_detection_image_url: string,
    text_recognition_image_url: string,
    text_interpretation_image_url: string,
    result_detection:{ [key: string]: Detection },
    result_recognition: { [key: string]: Detection },
    result_interpretation: { [key: string]: Detection },
    created_at: string,
    updated_at: string
}