import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../interfaces/project';
import { Image } from '../interfaces/image';
import { AiModel } from '../interfaces/ai_model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { param } from 'cypress/types/jquery';
import { AiChainModule } from '../interfaces/ai_chain_module';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private http: HttpClient) {
  }
  
  private projectsSubject = new BehaviorSubject<Project[]>([]);

  loadProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('store/projects/').pipe(
      tap(projects => {
        this.projectsSubject.next(projects);
      }),
      catchError(error => {
        console.error("Could not get projects", error);
        return of([]);
      })
    );
  }

  getProjectsObservable(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getProjects(): Observable<Project[]> {
    const url = 'store/projects/';
    return this.http.get<Project[]>(url);
  }

  getProject(projectId: number): Observable<Project> {
    const url = 'store/projects'
    return this.http.get<Project>(`${url}/${projectId}`);
  }

  createProject(data: any) {
    const url = 'store/projects/';
    return this.http.post(url, data);
  }

  getImages(projectId: number): Observable<Image[]> {
    const url = 'store/projects';
    return this.http.get<Image[]>(`${url}/${projectId}/images/`);
  }

  uploadImage(projectId: number, formData: FormData) {
    const url = 'store/projects';
    return this.http.post(`${url}/${projectId}/images/`, formData);
  }

  getAIModels(): Observable<AiModel[]> {
    const url = 'store/ais/';
    return this.http.get<AiModel[]>(url);
  }

  getAIChainModules(project_id: number): Observable<AiChainModule[]> {
    const url = 'store/projects/';
    return this.http.get<AiChainModule[]>(`${url}${project_id}/modules`);
  }

  deleteImg(projectId: number, imageId: number) {
    const url = 'store/projects'
    return this.http.delete(`${url}/${projectId}/images/${imageId}`);
  }

  deleteProject(projectId: number) {
    const url = 'store/projects'
    return this.http.delete(`${url}/${projectId}`);
  }

  editProject(projectId: number, data: any) {
    const url = 'store/projects'
    return this.http.patch(`${url}/${projectId}`, data);
  }

}