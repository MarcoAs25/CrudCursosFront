import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryFormComponent } from './category-form/category-form.component';
import { every, first } from 'rxjs';
import { ConfirmActionComponent } from '../../shared/confirm-action/confirm-action.component';

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss', '../home.component.scss']
})

export class CategoryComponent {

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = [];
  totalElements = 0;
  filterValue: string | null = '';

  filter = {
    size: 10,
    page: 0,
    filterValue: ''
  }
  constructor(private service: CategoryService, private snackbar: MatSnackBar, private dialog: MatDialog){
    this.findAllPageable();
  }
  findAllPageable() {
    this.service.findAllPageable(this.filter.page, this.filter.size, this.filter.filterValue).subscribe({
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
    this.openSnackbar("Error: " + error.error.message, "error");
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

  editElement(row: Category){
    this.dialog.open(CategoryFormComponent, {
      data: {
        newCategory: false,
        category: row,
        categoryId: row.id
      },
    }).beforeClosed().pipe(first()).subscribe({
      next:(update)=>{
        if(update){
          this.findAllPageable();
        }
      }
    })
  }
  deleteElement(row: Category){
    this.dialog.open(ConfirmActionComponent, {
      data:{
        op1:'Cancel',
        op2:'Delete',
        actionText:'Do you want to delete this category?',
        color: "warn",
      }
    }).beforeClosed().pipe(first()).subscribe({
      next:(candelete)=>{
        if(candelete){
          this.service.deleteById(row.id).subscribe({
            next:(_)=>{
                this.openSnackbar("Category deleted!","sucess");
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
    this.dialog.open(CategoryFormComponent, {
      data: {
        newCategory: true,
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
    return;
  }
}
