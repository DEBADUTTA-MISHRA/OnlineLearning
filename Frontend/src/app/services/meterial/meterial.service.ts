import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterialService {

  private apiUrl = 'http://localhost:3000/api/material'

  constructor(private http:HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadMaterial(courseId:any,lessonId:any, materialData: FormData) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/upload/${courseId}/${lessonId}`, materialData, { headers });
  }

  deleteMaterial(courseId:any,lessonId:any, meterialId:any) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete/${courseId}/${lessonId}/${meterialId}`, { headers });
  }

  getMaterials(courseId: string, lessonId: string) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${courseId}/${lessonId}`, { headers });
  }
}
