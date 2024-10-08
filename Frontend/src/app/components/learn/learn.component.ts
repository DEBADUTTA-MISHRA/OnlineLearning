import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course/course.service';
import { QuizesService } from '../../services/quizes/quizes.service';
import { ToastrService } from 'ngx-toastr';

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
  progress: any = 0;
  videoProgress: { [key: string]: boolean } = {};
  lessonsCompleted: number = 0;
  quizzesCompleted: number = 0;
  materialsCompleted: number = 0;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private quizesService: QuizesService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    this.courseService.getCoursesById(courseId).subscribe(course => {
      if (course && course.data) {
        this.course = course.data;

        // Initialize video progress for lessons and materials
        this.course.lessons.forEach((lesson: any) => {
          lesson.learningMaterials.forEach((material: any) => {
            this.videoProgress[material._id] = false;
          });

          if (lesson.quizzes && lesson.quizzes.length > 0) {
            this.quizzes.push(...lesson.quizzes);
          }
        });

        this.getCourseProgress(course.data._id);
      } else {
        this.toastr.error("Course data is missing or incomplete");
        console.error('Course data is missing or incomplete:', course);
      }
    });
  }

 // Call backend API to update progress
 updateProgress() {
  const progressData = {
    lessonsCompleted: this.lessonsCompleted,
    quizzesCompleted: this.quizzesCompleted,
    materialsCompleted: this.materialsCompleted,
  };

  this.courseService.updateCourseProgress(this.course._id, progressData).subscribe((response) => {
    this.getCourseProgress(this.course._id); // Refresh progress after update
  });
}

// Get course progress from the backend
getCourseProgress(courseId: string) {
  this.courseService.getCourseProgress(courseId).subscribe((response) => {
    console.log("response",response);
    this.progress = response;
  });
}


  startQuiz() {
    if (this.quizzes.length > 0) {
      this.showQuiz = true;
      this.quiz = this.quizzes[0];
    } else {
      this.toastr.warning("No quizzes available.");
      console.warn('No quizzes available.');
    }
  }

  submitQuiz() {
    const answers = Object.values(this.selectedAnswers);
    this.quizesService.submitQuiz(this.course._id, this.quiz._id, { answers }).subscribe(() => {
      this.updateProgress();
      this.showQuiz = false;
      this.quizzesCompleted++;
    });
  }

  selectAnswer(questionId: string, answer: string) {
    this.selectedAnswers[questionId] = answer;
  }

  // markVideoComplete(videoId: string) {
  //   this.videoProgress[videoId] = true;
  //   this.updateProgress();
  // }


  markVideoComplete(materialId: string) {
    console.log("materialId",materialId);
    // Mark video as completed and update progress
    if (!this.videoProgress[materialId]) {
      this.videoProgress[materialId] = true;
      this.materialsCompleted++; // Increment completed materials

      // After video completion, call backend API to update progress
      this.updateProgress();
    }
  }


  handleVideoError(material: any) {
    this.toastr.error("Video failed to load")
    console.error('Video failed to load:', material);
    // You can display a message or an alternative content here
  }
}
