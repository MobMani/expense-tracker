import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contributors-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contributors-list.component.html',
  styleUrl: './contributors-list.component.css'
})
export class ContributorsListComponent {
  constructor(public data: DataService) {}

  sorted = computed(() =>
    [...this.data.contributors()].sort((a, b) => (a.date < b.date ? 1 : -1))
  );

  average = computed(() => {
    const count = this.data.contributorCount();
    return count ? this.data.totalCollected() / count : 0;
  });

  largest = computed(() =>
    this.data.contributors().reduce((max, c) => Math.max(max, c.amount), 0)
  );
}
