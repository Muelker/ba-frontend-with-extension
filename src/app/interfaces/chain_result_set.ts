import { ChainResult } from "./chain_result"

export interface ChainResultSet{
    id: number,
    project_id: number,
    image_id: number,
    created_at: string,
    results: { [key: string]: ChainResult }
}