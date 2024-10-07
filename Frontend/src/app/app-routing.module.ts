import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SigninComponent } from './components/signin/signin.component';
import { PageContentComponent } from './components/page-content/page-content.component';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { LearnComponent } from './components/learn/learn.component';
import { QuizComponent } from './components/quiz/quiz.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: SigninComponent },
  { path: 'signup', component: SignUpComponent },
  {path:'page', component:PageContentComponent},
  { path: 'courses', component: CourseManagementComponent },
  {path:'learn/:courseId', component:LearnComponent},
  {path:'quiz', component:QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
