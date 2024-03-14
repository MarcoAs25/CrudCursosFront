import { Category } from './../components/home/category/category.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly API = '/api/category';

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http
      .get<Category[]>(`${this.API}`)
      .pipe(first());
  }

  findAllPageable(page: number, size: number, filter: string | null) {
    return this.http
      .get<any>(`${this.API}/pageable?size=${size}&page=${page}&filter=${filter}`)
      .pipe(first());
  }
  create(record: {name: string | null}) {
    return this.http
      .post<Category>(`${this.API}`, record)
      .pipe(first());
  }
  update(record: { name: string | null; }, categoryId: number | null) {
    return this.http
      .put<Category>(`${this.API}/${categoryId}`, record)
      .pipe(first());
  }
  deleteById(categoryId: number) {
    return this.http
    .delete<Category>(`${this.API}/${categoryId}`)
    .pipe(first());
  }
}
