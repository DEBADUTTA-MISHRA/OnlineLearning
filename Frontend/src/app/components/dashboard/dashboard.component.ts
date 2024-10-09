import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { LessonService } from '../../services/lesson/lesson.service';
import { MeterialService } from '../../services/meterial/meterial.service';
import { AuthService } from '../../services/auth/auth.service';
import { QuizesService } from '../../services/quizes/quizes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  courses: any[] = [];
  isCreateCourseVisible = false;
  isUpdateCourseVisible = false;
  isAddLessonVisible = false;
  isUploadMaterialsVisible = false;
  isAddQuizVisible = false;
  isUpdateLessonVisible=false;

  newCourse = {
    title: '',
    description: '',
    category: '',
    tags: '',
  };

  selectedImage: File | null = null;

  newLesson = {
    title: '',
    content: ''
  };

  newMaterial = {
    type: '',
    url: '',
    title: '',
    description: '',
    duration: 0
  };

  selectedFile: File | null = null;

  newQuiz = { title: '', questions: [{ question: '', options: '', correctAnswer: '' }] };

  currentCourseId: string = '';
  currentLessonId: string = '';
  userId: string = '';
  currentMaterialId: string = '';

  constructor(
    private courseService: CourseService,
    private lessonService: LessonService,
    private materialService: MeterialService,
    private authService: AuthService,
    private quizService: QuizesService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserID()
    this.fetchCourses();
  }



  getUserID() {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.userId = res.user._id;
      },
      error: (err) => {
        this.toastr.error("Error fetching user profile");
        console.error('Error fetching user profile', err);
      }
    });
  }

  fetchCourses() {
    this.courseService.getCourses().subscribe(
      (response) => {
        if (response && response.success) {
          this.courses = response.data.filter((course: any) =>
            course.creator && course.creator._id === this.userId
          );
        } else {
          this.toastr.warning("Failed to fetch courses");
          console.warn("Failed to fetch courses", response);
        }
      },
      (error) => {
        console.error('Error fetching courses', error);
        this.toastr.error("Error fetching courses");
      }
    );
  }

  showCreateCourseForm() {
    this.isCreateCourseVisible = true;
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
  }
  
  createCourse() {
    const formData = new FormData();
  
    formData.append('title', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('category', this.newCourse.category);
    formData.append('tags', this.newCourse.tags.split(',').map(tag => tag.trim()).join(','));
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    this.courseService.createCourse(formData).subscribe(
      (response) => {
  
        if (response && response.success) {
          this.fetchCourses();
        } else {
          this.toastr.warning("Unexpected response structure");
          console.warn("Unexpected response structure:", response);
        }

        this.resetCourseForm();
        this.isCreateCourseVisible = false;
        
      },
      (error) => {
        console.error('Failed to create course', error);
      }
    );
  }



  deleteCourse(courseId: string) {
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
        this.courses = this.courses.filter(course => course.id !== courseId);
        this.fetchCourses();
      },
      (error) => {
        console.error('Failed to delete course', error);
        this.toastr.error("Failed to delete course");
      }
    );
  }

  updateCourse(courseId: string, courseUpdate: any) {
    this.courseService.updateCourse(courseId, courseUpdate).subscribe(
      (response) => {
        if (response && response.success) {
          const index = this.courses.findIndex(course => course._id === courseId);
          if (index !== -1) {
            this.courses[index] = { ...this.courses[index], ...courseUpdate };
          }
          this.isCreateCourseVisible = false;
          this.resetCourseForm();
        } else {
          console.warn("Failed to update course", response);
        }
      },
      (error) => {
        console.error('Error updating course', error);
        this.toastr.error("Error updating course");
      }
    );
  }


  showUpdateCourseForm(course: any) {
    this.newCourse = { ...course };
    this.currentCourseId = course._id;
    this.isUpdateCourseVisible = true;
  }

  showAddLessonForm(course: any) {
    this.currentCourseId = course._id;
    this.isAddLessonVisible = true;
  }

  createLesson() {
    const lessonData = { ...this.newLesson };
    this.lessonService.createLesson(this.currentCourseId, lessonData).subscribe(
      (data) => {
        const courseIndex = this.courses.findIndex(course => course._id === this.currentCourseId);
        if (courseIndex !== -1) {
          this.courses[courseIndex].lessons.push(data.lesson);
        }
        this.isAddLessonVisible = false;
        this.resetLessonForm();
        this.fetchCourses();
      },
      (error) => {
        console.error('Failed to create lesson', error);
        this.toastr.error("Failed to create lesson");
      }
    );
  }

  showUploadMaterialsForm(course: any, lesson: any) {
    this.currentCourseId = course;
    this.currentLessonId = lesson;
    this.isUploadMaterialsVisible = true;
}


 onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}


uploadMaterials(courseId: string, lessonId: string): void {
  if (!this.selectedFile) {
    this.toastr.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('video', this.selectedFile);
  formData.append('title', this.newMaterial.title);
  formData.append('description', this.newMaterial.description);
  formData.append('duration', this.newMaterial.duration.toString());

  this.materialService.uploadMaterial(courseId, lessonId, formData).subscribe(
    (response) => {
      this.toastr.success("Material uploaded successfully");
      this.isUploadMaterialsVisible = false;
      this.resetMaterialForm();
      this.fetchMaterialsByLesson(courseId, lessonId);
      this.fetchCourses();
    },
    (error) => {
      console.error('Failed to upload materials', error);
      this.toastr.error("Failed to upload materials");
    }
  );
}

  resetCourseForm() {
    this.newCourse = {
      title: '',
      description: '',
      category: '',
      tags: ''
    };
    this.selectedFile = null; 
  }

  resetLessonForm() {
    this.newLesson = {
      title: '',
      content: ''
    };
  }

  resetMaterialForm() {
    this.newMaterial = {
      type: '',
      url: '',
      title: '',
      description: '',
      duration: 0
    };
  }

  showUpdateLessonForm(lesson: any) {
    this.newLesson = { ...lesson };
    this.currentLessonId = lesson._id;
    this.isUpdateLessonVisible = true;
  }

  deleteMaterial(courseId: string, lessonId: string, materialId: string) {
    this.materialService.deleteMaterial(courseId,lessonId,materialId).subscribe(
      (response) => {
        this.toastr.success("Material deleted successfully");
        this.fetchMaterialsByLesson(courseId,lessonId); 
        this.fetchCourses();
      },
      (error) => {
        this.toastr.error('Failed to delete material', error);
      }
    );
}


showAddQuizForm(course: any, lesson: any) {
  this.currentCourseId = course;
  this.currentLessonId = lesson;
  this.isAddQuizVisible = true;
}

createQuiz(lessonId: string) {
  const quizData = {
      courseId: this.currentCourseId,
      lessonId: lessonId, 
      title: this.newQuiz.title,
      questions: this.newQuiz.questions.map(q => ({
          question: q.question,
          options: q.options.split(',').map(opt => opt.trim()),
          correctAnswer: q.correctAnswer
      }))
  };

  this.quizService.createQuiz(quizData.courseId, quizData.lessonId, quizData).subscribe(
    () => {
      this.toastr.success("Quiz created successfully");
      this.isAddQuizVisible = false;
      this.resetQuizForm();
      this.fetchMaterialsByLesson(quizData.courseId, lessonId);
    },
    (error) => {
      this.toastr.error('Error creating quiz', error);
    }
  );
}

resetQuizForm() {
  this.newQuiz = {
    title: '',
    questions: [{ question: '', options: '', correctAnswer: '' }]
  };
}

addAnotherQuestion() {
  this.newQuiz.questions.push({ question: '', options: '', correctAnswer: '' });
}

  fetchMaterialsByLesson(courseId:string, lessonId: string) {
    this.materialService.getMaterials(courseId , lessonId).subscribe(
      (response) => {
        this.courses = this.courses.map(course => {
          course.lessons = course.lessons.map((lesson:any) => {
            if (lesson._id === lessonId) {
              lesson.materials = response.data;
            }
            return lesson;
          });
          return course;
        });
      },
      (error) => {
        this.toastr.error('Error fetching materials');
        console.error('Error fetching materials', error);
      }
    );
  }

}