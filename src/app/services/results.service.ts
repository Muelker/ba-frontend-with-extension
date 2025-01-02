import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Results } from '../interfaces/results';
import { Project } from '../interfaces/project';
import { Image } from '../interfaces/image';
import { AiModel } from '../interfaces/ai_model';
import { environment } from '../../environments/environment';
import { ChainResultSet } from '../interfaces/chain_result_set';


@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) {
  }

  startVisualization(projectId: number, aiChainModuleList: number[]) {
    const url = 'store/projects';
    return this.http.post(`${url}/${projectId}/start/`, aiChainModuleList);
  }

  startVisualizationRest(projectId: number, aiChainModuleList: number[]) {
    const url = 'store/projects';
    return this.http.post(`${url}/${projectId}/start_rest/`, aiChainModuleList);
  }

  getOverlays(projectId: number): Observable<Results[]> {
    const url = 'store/projects';
    return this.http.get<Results[]>(`${url}/${projectId}/results`);
  }

  getChainOverlays(projectId: number): Observable<ChainResultSet[]> {
    const url = 'store/projects';
    return this.http.get<ChainResultSet[]>(`${url}/${projectId}/chainresults`);
  }
}
