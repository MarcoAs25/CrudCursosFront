import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';

const routes: Routes = [
  {
    path:'',
    pathMatch: 'prefix',
    redirectTo: 'category'
  },
  {
    path:'category',
    component: CategoryComponent
  },
  {
    path:'course',
    component: CourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
