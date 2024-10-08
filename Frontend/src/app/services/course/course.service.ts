import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) {}

  // Method to get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Method to set headers with the token
  private getAuthHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createCourse(courseData:FormData) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/create`,courseData, { headers });
  }

  getCourses() : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }

  updateCourse(courseId: string, courseUpdate:any) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/update/${courseId}`,courseUpdate, { headers });
  }

  deleteCourse(courseId: string) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete/${courseId}`, { headers });
  }

  getCourseByCategory(category:any) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/category/${category}`, { headers });
  }

  enrollCourse(courseId:any) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/enroll/${courseId}`,{}, { headers });
  }

  unenrollCourse(courseId:any) : Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/unenroll/${courseId}`, {}, { headers })
  }

  getEnrolledCourses() {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/enrolled`, { headers });
  }

  getCoursesById(courseId:any) {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${courseId}`, { headers });
  }

  updateCourseProgress(courseId:any, progressData:any) : Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/progress/${courseId}`, {progressData}, { headers });
  }

  getCourseProgress(courseId:any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/progress/${courseId}`, { headers });
  }
}
