import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private apiUrl = 'http://localhost:3000/api/lessons';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createLesson(courseId: any, lessonData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/create/${courseId}`, lessonData, { headers });
  }

  getLessonByCourse(courseId: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${courseId}`, { headers });
  }

  updateLesson(lessonId: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${lessonId}`, { headers });
  }

  deleteLesson(lessonId: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${lessonId}`, { headers });
  }

}
