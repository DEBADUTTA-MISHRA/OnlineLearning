import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizesService {

  private apiUrl = 'http://localhost:3000/api/quizzes'

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

  createQuiz(courseId:any, lessonId:any, quizData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/addQuiz/${courseId}/${lessonId}`, quizData, { headers });
  }

  submitQuiz(courseId:any, quizId: any,  data: { answers: string[] }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/submit/${courseId}/${quizId}`,data, { headers });
  }

  getQuizScore(quizId: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/results/${quizId}`, { headers });
  }

  startQuiz(quizId: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/start/${quizId}`, {}, { headers });
  }
}
