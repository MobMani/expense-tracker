import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contributor, DataService, Expense } from '../../services/data.service';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css'
})
export class AdminManageComponent {
  activeTab: 'contributors' | 'expenses' = 'contributors';

  // Contributor form state
  editingContributorId: string | null = null;
  contributorName = '';
  contributorAmount: number | null = null;
  contributorDate = today();
  contributorNote = '';

  // Expense form state
  editingExpenseId: string | null = null;
  expensePurpose = '';
  expenseAmount: number | null = null;
  expenseDate = today();
  expenseNote = '';

  formError = '';

  constructor(public data: DataService) {}

  sortedContributors = computed(() =>
    [...this.data.contributors()].sort((a, b) => (a.date < b.date ? 1 : -1))
  );
  sortedExpenses = computed(() =>
    [...this.data.expenses()].sort((a, b) => (a.date < b.date ? 1 : -1))
  );

  selectTab(tab: 'contributors' | 'expenses'): void {
    this.activeTab = tab;
    this.formError = '';
  }

  // ---- Contributors ----

  startEditContributor(c: Contributor): void {
    this.editingContributorId = c.id;
    this.contributorName = c.name;
    this.contributorAmount = c.amount;
    this.contributorDate = c.date;
    this.contributorNote = c.note ?? '';
    this.formError = '';
  }

  cancelContributorEdit(): void {
    this.editingContributorId = null;
    this.contributorName = '';
    this.contributorAmount = null;
    this.contributorDate = today();
    this.contributorNote = '';
    this.formError = '';
  }

  submitContributor(): void {
    this.formError = '';
    if (!this.contributorName.trim()) {
      this.formError = 'Enter the contributor\u2019s name.';
      return;
    }
    if (this.contributorAmount === null || this.contributorAmount <= 0) {
      this.formError = 'Enter an amount greater than zero.';
      return;
    }
    const payload: Omit<Contributor, 'id'> = {
      name: this.contributorName.trim(),
      amount: this.contributorAmount,
      date: this.contributorDate || today(),
      note: this.contributorNote.trim() || undefined
    };
    if (this.editingContributorId) {
      this.data.updateContributor(this.editingContributorId, payload);
    } else {
      this.data.addContributor(payload);
    }
    this.cancelContributorEdit();
  }

  removeContributor(id: string): void {
    if (this.editingContributorId === id) this.cancelContributorEdit();
    this.data.deleteContributor(id);
  }

  // ---- Expenses ----

  startEditExpense(e: Expense): void {
    this.editingExpenseId = e.id;
    this.expensePurpose = e.purpose;
    this.expenseAmount = e.amount;
    this.expenseDate = e.date;
    this.expenseNote = e.note ?? '';
    this.formError = '';
  }

  cancelExpenseEdit(): void {
    this.editingExpenseId = null;
    this.expensePurpose = '';
    this.expenseAmount = null;
    this.expenseDate = today();
    this.expenseNote = '';
    this.formError = '';
  }

  submitExpense(): void {
    this.formError = '';
    if (!this.expensePurpose.trim()) {
      this.formError = 'Enter what the money was spent on.';
      return;
    }
    if (this.expenseAmount === null || this.expenseAmount <= 0) {
      this.formError = 'Enter an amount greater than zero.';
      return;
    }
    const payload: Omit<Expense, 'id'> = {
      purpose: this.expensePurpose.trim(),
      amount: this.expenseAmount,
      date: this.expenseDate || today(),
      note: this.expenseNote.trim() || undefined
    };
    if (this.editingExpenseId) {
      this.data.updateExpense(this.editingExpenseId, payload);
    } else {
      this.data.addExpense(payload);
    }
    this.cancelExpenseEdit();
  }

  removeExpense(id: string): void {
    if (this.editingExpenseId === id) this.cancelExpenseEdit();
    this.data.deleteExpense(id);
  }
}
