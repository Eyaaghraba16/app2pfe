import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      type="text"
      [(ngModel)]="searchTerm"
      (input)="onSearch()"
      placeholder="Rechercher un employé..."
      class="search-input"
    />
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 300px;
    }
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .search-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,.2);
    }
  `]
})
export class SearchBarComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }
}
