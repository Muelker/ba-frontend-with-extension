import { Detection } from "./detection"

export interface ChainResult {
    'id': number, 
    'module_name'?: string, 
    'image_id': number,
    'image_url': string, 
    'result': { [key: string]: Detection },
    'created_at': string
}