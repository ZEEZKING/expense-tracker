import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  FilterExpenseRequest,
  CategorySummary,
  TrendData
} from '../models/expense.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createExpense(data: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<any>(`${this.API_URL}/api/Expense/create`, data)
      .pipe(map(res => res.data));
  }

  updateExpense(data: UpdateExpenseRequest): Observable<Expense> {
    return this.http.put<any>(`${this.API_URL}/api/Expense/update`, data)
      .pipe(map(res => res.data));
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/Expense/${id}`);
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<any>(`${this.API_URL}/api/Expense/${id}`)
      .pipe(map(res => res.data));
  }

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<any>(`${this.API_URL}/api/Expense/all`)
      .pipe(map(res => res.data || []));
  }

  getCategorySummary(): Observable<CategorySummary[]> {
    return this.http.get<any>(`${this.API_URL}/api/Expense/summary/category`)
      .pipe(map(res => res.data || []));
  }

  filterExpenses(filter: FilterExpenseRequest): Observable<Expense[]> {
    return this.http.post<any>(`${this.API_URL}/api/Expense/filter`, filter)
      .pipe(map(res => res.data || []));
  }

  getTrend(): Observable<TrendData[]> {
    return this.http.get<any>(`${this.API_URL}/api/Expense/trend`)
      .pipe(map(res => res.data || []));
  }
}
