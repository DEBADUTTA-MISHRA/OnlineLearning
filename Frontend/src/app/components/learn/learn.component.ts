import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course/course.service';
import { QuizesService } from '../../services/quizes/quizes.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {
  course: any = {};
  quizzes: any[] = [];
  quiz: any = null;
  showQuiz = false;
  selectedAnswers: { [key: string]: string } = {};
  progress: number = 0;
  videoProgress: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private quizesService: QuizesService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    this.courseService.getCoursesById(courseId).subscribe(course => {
      if (course && course.data) {
        this.course = course.data;

        // Initialize video progress for lessons and materials
        this.course.lessons.forEach((lesson: any) => {
          lesson.learningMaterials.forEach((material: any) => {
            console.log('Video URL:', material.url); // Log URL for debugging
            this.videoProgress[material._id] = false;
          });

          if (lesson.quizzes && lesson.quizzes.length > 0) {
            this.quizzes.push(...lesson.quizzes);
          }
        });

        this.getCourseProgress(course.data._id);
      } else {
        console.error('Course data is missing or incomplete:', course);
      }
    });
  }

  updateProgress() {
    this.courseService.updateCourseProgress(this.course._id).subscribe(() => {
      this.getCourseProgress(this.course._id);
    });
  }

  getCourseProgress(courseId: any) {
    this.courseService.getCourseProgress(courseId).subscribe(progress => {
      this.progress = progress.percentage;
    });
  }

  startQuiz() {
    if (this.quizzes.length > 0) {
      this.showQuiz = true;
      this.quiz = this.quizzes[0];
    } else {
      console.warn('No quizzes available.');
    }
  }

  submitQuiz() {
    const answers = Object.values(this.selectedAnswers);
    this.quizesService.submitQuiz(this.course._id, this.quiz._id, { answers }).subscribe(() => {
      this.updateProgress();
      this.showQuiz = false;
    });
  }

  selectAnswer(questionId: string, answer: string) {
    this.selectedAnswers[questionId] = answer;
  }

  markVideoComplete(videoId: string) {
    this.videoProgress[videoId] = true;
    this.updateProgress();
  }

  handleVideoError(material: any) {
    console.error('Video failed to load:', material);
    // You can display a message or an alternative content here
  }
}
