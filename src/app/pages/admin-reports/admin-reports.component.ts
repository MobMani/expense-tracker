import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent {
  constructor(public data: DataService) {}

  sortedContributors = computed(() =>
    [...this.data.contributors()].sort((a, b) => (a.date < b.date ? 1 : -1))
  );
  sortedExpenses = computed(() =>
    [...this.data.expenses()].sort((a, b) => (a.date < b.date ? 1 : -1))
  );
  byPurpose = computed(() => this.data.expensesByPurpose());

  /** Share of collected funds already spent, 0–100 (capped for the meter). */
  spentPercent = computed(() => {
    const collected = this.data.totalCollected();
    if (!collected) return this.data.totalSpent() ? 100 : 0;
    return Math.min(100, (this.data.totalSpent() / collected) * 100);
  });

  /** Each purpose's share of total spending, 0–100. */
  purposeShare(total: number): number {
    const spent = this.data.totalSpent();
    return spent ? (total / spent) * 100 : 0;
  }
}
