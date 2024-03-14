import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss', '../../home.component.scss'],
})
export class CategoryFormComponent {
  public newCategory = true;
  public loadingBtn = false;
  public categoryId = null;

  categoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CategoryService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryFormComponent>
  ) {
    this.newCategory = data.newCategory;
    if (!this.newCategory) {
      this.categoryId = data.categoryId;
      this.categoryFormGroup.patchValue({
        name: data.category.name,
      });
    }
  }

  save() {
    if (!this.categoryFormGroup.valid) {
      this.categoryFormGroup.markAllAsTouched();
      return;
    }
    this.loadingBtn = true;
    let record = {
      name: this.categoryFormGroup.value.name
        ? this.categoryFormGroup.value.name
        : null,
    };

    if (this.newCategory) {
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
      this.service.update(record, this.categoryId).subscribe({
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
