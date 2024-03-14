import { MatDialog } from '@angular/material/dialog';
import { Category } from './../category/category.component';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services/course.service';
import { ConfirmActionComponent } from '../../shared/confirm-action/confirm-action.component';
import { first } from 'rxjs';
import { CourseFormComponent } from './course-form/course-form.component';

export interface Course {
  id: number;
  name: string;
  category: Category
}

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss', '../home.component.scss']
})
export class CourseComponent {
  public displayedColumns: string[] = ['name', 'category', 'actions'];
  public dataSource : Category[] = [];
  totalElements = 0;
  filterValue: string | null = '';

  filter = {
    size: 10,
    page: 0,
    filterValue: ''
  }
  constructor(private service: CourseService, private snackbar: MatSnackBar, private dialog: MatDialog){
    this.findAllPageable();
  }
  findAllPageable() {
    this.service.findAll(this.filter.page, this.filter.size, this.filter.filterValue).subscribe({
      next:(response)=>{
        this.onFindAllSucess(response)
      },
      error:(error)=>{
        this.onError(error);
      }
    })
  }
  onFindAllSucess(response: any) {
    this.dataSource = response.content;
    this.totalElements = response.totalElements;
  }
  onError(error: any) {
    this.openSnackbar(" Error: " + error.error.message, "error");
  }
  openSnackbar(msg: string, type: 'error'|'warn'|'sucess'){
    if(!msg) msg = "Unexpected error";
    switch(type){
      case 'error':
        msg = '❌ ' + msg;
        break;
      case 'warn':
        msg = '⚠️ ' + msg;
        break;
      case 'sucess':
        msg = '✔️ ' + msg;
        break;
    }
    this.snackbar.open(msg, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass:['custom-snackbar'],
    });
  }

  editElement(row: Course){
    this.dialog.open(CourseFormComponent, {
      data: {
        newCourse: false,
        course: row,
        courseId: row.id
      },
    }).beforeClosed().pipe(first()).subscribe({
      next:(update)=>{
        if(update){
          this.findAllPageable();
        }
      }
    })
  }
  deleteElement(row: Course){
    this.dialog.open(ConfirmActionComponent, {
      data:{
        op1:'Cancel',
        op2:'Delete',
        actionText:'Delete this course?',
        color: "warn",
      }
    }).beforeClosed().pipe(first()).subscribe({
      next:(candelete)=>{
        if(candelete){
          this.service.deleteById(row.id).subscribe({
            next:(_)=>{
                this.openSnackbar("Course deleted!","sucess");
                this.findAllPageable();
            },
            error: (err)=>{
              this.onError(err);
            }
          })
        }
      }
    })
  }
  changePage(ev: PageEvent) {
    this.filter = {
      ...this.filter,
      page: ev.pageIndex,
      size: ev.pageSize,
    };

    this.findAllPageable();
  }

  create() {
    this.dialog.open(CourseFormComponent, {
      data: {
        newCourse: true,
      },
    }).beforeClosed().pipe(first()).subscribe({
      next:(update)=>{
        if(update){
          this.findAllPageable();
        }
      }
    })
  }

  applyFilter(event: KeyboardEvent) {
    this.filter = {
      ...this.filter,
      filterValue: this.filterValue? this.filterValue: ''
    }
    this.findAllPageable();
  }
}
