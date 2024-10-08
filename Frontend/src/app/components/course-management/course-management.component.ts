import { Component } from '@angular/core';
import { CourseService } from '../../services/course/course.service';
import { response } from 'express';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss'
})
export class CourseManagementComponent {
  courses: any[] = [];
  enrolledCourses: any[] = [];
  searchKey:any='';
  filteredCourses: any[]=[];
  courseId: any;
  courseDetails: any;
  learnCourses: any;
  lessonsCompleted: number = 0;
  quizzesCompleted: number = 0;
  materialsCompleted: number = 0;
  
  constructor(private courseService: CourseService, private router:Router, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.getCourses();
    this.getEnrolledCourses();
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    if (this.courseId) {
      this.getCourseDetails(this.courseId);
    }
  }

  getCourses(): void {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data.data;
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  filterCourses(){
    this.courseService.getCourseByCategory(this.searchKey).subscribe(
      (response) => {
        this.courses = response.courses;
      },
      (error) => {
        console.error('Error finding course:', error);
      }
    );
  }
  enrollCourse(courseId: string): void {
    this.courseService.enrollCourse(courseId).subscribe(
      (response) => {
        this.getEnrolledCourses(); // Refresh the enrolled courses
      },
      (error) => {
        console.error('Error enrolling in course:', error);
      }
    );
  }

  unenrollCourse(courseId: string): void {
    this.courseService.unenrollCourse(courseId).subscribe(
      (response) => {
        this.getEnrolledCourses(); // Refresh the enrolled courses
      },
      (error) => {
        console.error('Error unenrolling from course:', error);
      }
    );
  }

  getEnrolledCourses(): void {
    this.courseService.getEnrolledCourses().subscribe(
      (data) => {
        this.enrolledCourses = data.enrolledCourses; // Assign the correct path
      },
      (error) => {
        console.error('Error fetching enrolled courses:', error);
      }
    );
  }
  
  updateCourseProgress(courseId: string): void {
    const progressData = {
      lessonsCompleted: this.lessonsCompleted,
      quizzesCompleted: this.quizzesCompleted,
      materialsCompleted: this.materialsCompleted,
    };
    this.courseService.updateCourseProgress(courseId, progressData).subscribe(
      (response) => {
        console.log('Course progress updated:', response);
      },
      (error) => {
        console.error('Error updating course progress:', error);
      }
    );
  }

  getCourseProgress(courseId: string): void {
    this.courseService.getCourseProgress(courseId).subscribe(
      (response) => {
        console.log('Course progress:', response);
      },
      (error) => {
        console.error('Error fetching course progress:', error);
      }
    );
  }


  startLearning(courseId: string) {
    this.learnCourses = this.getCourseDetails(courseId)
    this.router.navigate(['/learn', courseId]);
  }

  getCourseDetails(courseId:any): void {
    this.courseService.getCoursesById(courseId).subscribe(
      (data) => {
        this.courseDetails = data; // Store the course data
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  

}
