import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  quiz = {}; // Fetch quiz from API

  submitQuiz() {
    // Call backend to submit quiz answers and update progress
  }
  
}
