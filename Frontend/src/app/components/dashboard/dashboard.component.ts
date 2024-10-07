import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { LessonService } from '../../services/lesson/lesson.service';
import { MeterialService } from '../../services/meterial/meterial.service';
import { AuthService } from '../../services/auth/auth.service';
import { QuizesService } from '../../services/quizes/quizes.service';

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
    private quizService: QuizesService
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
          console.warn("Failed to fetch courses", response);
        }
      },
      (error) => {
        console.error('Error fetching courses', error);
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
    const formData = new FormData(); // Use FormData to handle both text and file data
  
    formData.append('title', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('category', this.newCourse.category);
    formData.append('tags', this.newCourse.tags.split(',').map(tag => tag.trim()).join(',')); // Convert tags to a string
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    this.courseService.createCourse(formData).subscribe(
      (response) => {
        console.log("API response:", response);
  
        if (response && response.success) {
          this.fetchCourses();
        } else {
          console.warn("Unexpected response structure:", response);
        }
  
        this.isCreateCourseVisible = false;
        this.resetCourseForm();
      },
      (error) => {
        console.error('Failed to create course', error);
      }
    );
  }



  deleteCourse(courseId: string) {
    console.log("courseId_delete", courseId);
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
        this.courses = this.courses.filter(course => course.id !== courseId);
        this.fetchCourses();
      },
      (error) => {
        console.error('Failed to delete course', error);
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
    console.log("currentCourseId", this.currentCourseId);
    this.lessonService.createLesson(this.currentCourseId, lessonData).subscribe(
      (data) => {
        const courseIndex = this.courses.findIndex(course => course._id === this.currentCourseId);
        if (courseIndex !== -1) {
          this.courses[courseIndex].lessons.push(data.lesson);
        }
        this.isAddLessonVisible = false;
        this.resetLessonForm();
      },
      (error) => {
        console.error('Failed to create lesson', error);
      }
    );
  }

  showUploadMaterialsForm(course: any, lesson: any) {
    console.log("lessons",lesson);
    console.log("course", course);
    this.currentCourseId = course;
    this.currentLessonId = lesson; // Set currentLessonId
    this.isUploadMaterialsVisible = true;
}


 // Capture file input event
 onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFile = file;  // Store the selected file
  }
}


uploadMaterials(courseId: string, lessonId: string): void {
  if (!this.selectedFile) {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('video', this.selectedFile);  // Append the file
  formData.append('title', this.newMaterial.title);
  formData.append('description', this.newMaterial.description);
  formData.append('duration', this.newMaterial.duration.toString());

  // Call the materialService to upload the material
  this.materialService.uploadMaterial(courseId, lessonId, formData).subscribe(
    (response) => {
      console.log('Material uploaded successfully', response);
      this.isUploadMaterialsVisible = false;
      this.resetMaterialForm();
      this.fetchMaterialsByLesson(courseId, lessonId);  // Fetch updated materials
      this.fetchCourses();
    },
    (error) => {
      console.error('Failed to upload materials', error);
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

  // Implement the method to show update lesson form
  showUpdateLessonForm(lesson: any) {
    this.newLesson = { ...lesson }; // Load existing lesson data into form
    this.currentLessonId = lesson._id;
    this.isAddLessonVisible = true; // Show the add lesson form for updating
  }

  deleteMaterial(courseId: string, lessonId: string, materialId: string) {
    this.materialService.deleteMaterial(courseId,lessonId,materialId).subscribe(
      (response) => {
        console.log("Material deleted:", response);
        // Optionally fetch updated materials for the specific lesson
        this.fetchMaterialsByLesson(courseId,lessonId); 
        this.fetchCourses();
      },
      (error) => {
        console.error('Failed to delete material', error);
      }
    );
}


showAddQuizForm(course: any, lesson: any) {
  this.currentCourseId = course;
  this.currentLessonId = lesson; // Set currentLessonId
  this.isAddQuizVisible = true;
}

// Method to create a quiz
createQuiz(lessonId: string) {
  const quizData = {
      courseId: this.currentCourseId,
      lessonId: lessonId, 
      title: this.newQuiz.title,
      questions: this.newQuiz.questions.map(q => ({
          question: q.question,
          options: q.options.split(',').map(opt => opt.trim()), // Split options by comma
          correctAnswer: q.correctAnswer
      }))
  };

  this.quizService.createQuiz(quizData.courseId, quizData.lessonId, quizData).subscribe(
    () => {
      this.isAddQuizVisible = false;
      this.resetQuizForm(); // Reset form after successful submission
      this.fetchMaterialsByLesson(quizData.courseId, lessonId); // Optionally fetch materials for the updated lesson
    },
    (error) => {
      console.error('Error creating quiz', error);
    }
  );
}

// Method to reset the quiz form
resetQuizForm() {
  this.newQuiz = {
    title: '',
    questions: [{ question: '', options: '', correctAnswer: '' }]  // Reset to one empty question
  };
}

// Method to add another question to the quiz
addAnotherQuestion() {
  this.newQuiz.questions.push({ question: '', options: '', correctAnswer: '' }); // Add an empty question object
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
        console.error('Error fetching materials', error);
      }
    );
  }

}