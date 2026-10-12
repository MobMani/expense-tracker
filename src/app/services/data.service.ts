import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';

export interface Contributor {
  id: string;
  name: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Expense {
  id: string;
  purpose: string;
  amount: number;
  date: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly apiUrl = 'https://jsonfileapi-5sy7.onrender.com/api';

  contributors = signal<Contributor[]>([]);
  expenses = signal<Expense[]>([]);

  totalCollected = computed(() => this.contributors().reduce((sum, c) => sum + c.amount, 0));
  totalSpent = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));
  balance = computed(() => this.totalCollected() - this.totalSpent());
  contributorCount = computed(() => this.contributors().length);

  constructor(private http: HttpClient) {
    this.loadAll();
  }

  private loadAll(): void {
    this.http.get<Contributor[]>(`${this.apiUrl}/contributors`).subscribe({
      next: (data) => this.contributors.set(data ?? []),
      error: () => this.contributors.set([])
    });

    this.http.get<Expense[]>(`${this.apiUrl}/expenses`).subscribe({
      next: (data) => this.expenses.set(data ?? []),
      error: () => this.expenses.set([])
    });
  }

  addContributor(c: Omit<Contributor, 'id'>): void {
    this.http.post<Contributor>(`${this.apiUrl}/contributors`, c).subscribe({
      next: (created) => this.contributors.update((list) => [...list, created]),
      error: (error) => console.error('Failed to add contributor', error)
    });
  }

  updateContributor(id: string, changes: Partial<Omit<Contributor, 'id'>>): void {
    const existing = this.contributors().find((c) => c.id === id);
    if (!existing) return;

    const payload = { ...existing, ...changes };
    this.http.put<Contributor>(`${this.apiUrl}/contributors/${id}`, payload).subscribe({
      next: (updated) => {
        this.contributors.update((list) => list.map((c) => (c.id === id ? updated : c)));
      },
      error: (error) => console.error('Failed to update contributor', error)
    });
  }

  deleteContributor(id: string): void {
    this.http.delete(`${this.apiUrl}/contributors/${id}`).subscribe({
      next: () => {
        this.contributors.update((list) => list.filter((c) => c.id !== id));
      },
      error: (error) => console.error('Failed to delete contributor', error)
    });
  }

  addExpense(e: Omit<Expense, 'id'>): void {
    this.http.post<Expense>(`${this.apiUrl}/expenses`, e).subscribe({
      next: (created) => this.expenses.update((list) => [...list, created]),
      error: (error) => console.error('Failed to add expense', error)
    });
  }

  updateExpense(id: string, changes: Partial<Omit<Expense, 'id'>>): void {
    const existing = this.expenses().find((e) => e.id === id);
    if (!existing) return;

    const payload = { ...existing, ...changes };
    this.http.put<Expense>(`${this.apiUrl}/expenses/${id}`, payload).subscribe({
      next: (updated) => {
        this.expenses.update((list) => list.map((e) => (e.id === id ? updated : e)));
      },
      error: (error) => console.error('Failed to update expense', error)
    });
  }

  deleteExpense(id: string): void {
    this.http.delete(`${this.apiUrl}/expenses/${id}`).subscribe({
      next: () => {
        this.expenses.update((list) => list.filter((e) => e.id !== id));
      },
      error: (error) => console.error('Failed to delete expense', error)
    });
  }

  expensesByPurpose(): { purpose: string; total: number }[] {
    const map = new Map<string, number>();
    for (const e of this.expenses()) {
      map.set(e.purpose, (map.get(e.purpose) ?? 0) + e.amount);
    }
    return [...map.entries()]
      .map(([purpose, total]) => ({ purpose, total }))
      .sort((a, b) => b.total - a.total);
  }
}
