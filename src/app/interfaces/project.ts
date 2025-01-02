import { Image } from "./image";

export interface Project {
    id: number;
    name: string;
    description: string;
    ai_model_id: number;
    status: string;
    images_nr: number;
    images: Image[];
    created_at: string;
    updated_at: string;
  }