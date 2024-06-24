import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Column {
  items: number[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  columns = signal<Column[]>([
    { items: [] },
    { items: [] },
    { items: [] }
  ]);

  newItems: (number | null)[] = [null, null, null];
  errorMessage: string | null = null;

  addItem(columnIndex: number): void {
    if (this.newItems[columnIndex] === null || isNaN(this.newItems[columnIndex] as number)) {
      this.errorMessage = 'Please enter a valid number.';
      return;
    }

    this.columns.update(columns => {
      columns[columnIndex].items.push(this.newItems[columnIndex] as number);
      return columns;
    });

    this.newItems[columnIndex] = null;
    this.errorMessage = null;
  }

  editItem(columnIndex: number, itemIndex: number): void {
    const updatedItem = prompt('Edit item:', this.columns()[columnIndex].items[itemIndex].toString());
    if (updatedItem !== null && !isNaN(+updatedItem)) {
      this.columns.update(columns => {
        columns[columnIndex].items[itemIndex] = +updatedItem;
        return columns;
      });
    }
  }

  deleteItem(columnIndex: number, itemIndex: number): void {
    this.columns.update(columns => {
      columns[columnIndex].items.splice(itemIndex, 1);
      return columns;
    });
  }

  moveItemUp(columnIndex: number, itemIndex: number): void {
    if (itemIndex > 0) {
      this.columns.update(columns => {
        const items = columns[columnIndex].items;
        [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
        return columns;
      });
    }
  }

  moveItemDown(columnIndex: number, itemIndex: number): void {
    const items = this.columns()[columnIndex].items;
    if (itemIndex < items.length - 1) {
      this.columns.update(columns => {
        [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]];
        return columns;
      });
    }
  }

  moveItemLeft(columnIndex: number, itemIndex: number): void {
    if (columnIndex > 0) {
      this.columns.update(columns => {
        const item = columns[columnIndex].items.splice(itemIndex, 1)[0];
        columns[columnIndex - 1].items.push(item);
        return columns;
      });
    }
  }

  moveItemRight(columnIndex: number, itemIndex: number): void {
    if (columnIndex < this.columns().length - 1) {
      this.columns.update(columns => {
        const item = columns[columnIndex].items.splice(itemIndex, 1)[0];
        columns[columnIndex + 1].items.push(item);
        return columns;
      });
    }
  }

  getItemClass(item: number): string {
    if (item % 3 === 0 && item % 5 === 0) {
      return 'yellow';
    } else if (item % 3 === 0) {
      return 'green';
    } else if (item % 5 === 0) {
      return 'blue';
    } else {
      return 'red';
    }
  }
}
