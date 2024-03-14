import { Category } from './../../category/category.component';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss', '../../home.component.scss']
})
export class CourseFormComponent {
  public newCourse = true;
  public loadingBtn = false;
  public courseId = null;
  public categoryList : Category[] = [];

  courseFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    categoryId: new FormControl(null, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private service: CourseService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CourseFormComponent>
  ) {
    this.newCourse = data.newCourse;
    if (!this.newCourse) {
      this.courseId = data.courseId;
      this.courseFormGroup.patchValue({
        name: data.course.name,
        categoryId: data.course.category.id
      });
    }
    this.categoryService.findAll().subscribe({
      next: (response) => {this.categoryList = response; console.log(response)},
      error:(err) => {this.onError(err)}
    });
  }

  onError(error: any) {
    this.openSnackbar("Error: " + error.error.message, "error");
    this.close(false);
  }

  save() {
    if (!this.courseFormGroup.valid) {
      this.courseFormGroup.markAllAsTouched();
      return;
    }
    this.loadingBtn = true;
    let record = {
      name: this.courseFormGroup.value.name ? this.courseFormGroup.value.name : null,
      categoryId: this.courseFormGroup.value.categoryId ? this.courseFormGroup.value.categoryId : null,
    };

    if (this.newCourse) {
      this.service.create(record).subscribe({
        next: (value) => {
          if (value) {
            this.openSnackbar('Category created!', 'sucess');
          }
          this.loadingBtn = false;
          this.close(true);
        },
        error: (error) => {
          this.loadingBtn = false;
          this.openSnackbar('Error: ' + error.error.message, 'error');
        },
      });
    } else {
      this.service.update(record, this.courseId).subscribe({
        next: (value) => {
          if (value) {
            this.openSnackbar('Category updated!', 'sucess');
          }
          this.loadingBtn = false;
          this.close(true);
        },
        error: (error) => {
          this.loadingBtn = false;
          this.openSnackbar('Error: ' + error.error.message, 'error');
        },
      });
    }
  }

  close(value: boolean) {
    this.dialogRef.close(value);
  }

  openSnackbar(msg: string, type: 'error' | 'warn' | 'sucess') {
    if (!msg) msg = 'Unexpected error';
    switch (type) {
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
}
