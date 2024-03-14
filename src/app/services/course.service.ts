import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../components/home/course/course.component';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly API = '/api/course';

  constructor(private http: HttpClient) { }

  findAll(page: number, size: number, filter: string | null) {
    return this.http
      .get<Course[]>(`${this.API}/pageable?size=${size}&page=${page}&filter=${filter}`)
      .pipe(first());
  }
  create(record: {name: string | null}) {
    return this.http
      .post<Course>(`${this.API}`, record)
      .pipe(first());
  }
  update(record: { name: string | null; }, courseId: number | null) {
    return this.http
      .put<Course>(`${this.API}/${courseId}`, record)
      .pipe(first());
  }
  deleteById(courseId: number) {
    return this.http
    .delete<Course>(`${this.API}/${courseId}`)
    .pipe(first());
  }
}
