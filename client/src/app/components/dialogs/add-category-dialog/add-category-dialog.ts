import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog'
import { MatButtonModule, MatAnchor } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { Category } from '../../../models/category';

@Component({
  selector: 'app-add-category-dialog',
  imports: [FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatAnchor, MatDialogModule, MatButtonModule],
  templateUrl: './add-category-dialog.html',
  styleUrl: './add-category-dialog.css',
})
export class AddCategoryDialog {

  @Output()
  newCategory: EventEmitter<Category> = new EventEmitter<Category>;

  @Output()
  closeDialog: EventEmitter<void> = new EventEmitter<void>;

  @Input()
  existingCategories: Category[] = [];

  category: Partial<Category> = {};
  isInputValid: boolean = true;
  errorMessage = ``;

  onClose(): void {
    this.closeDialog.emit();
  }

  onSubmit() {
    this.isInputValid = true;
    this.errorMessage = ``;

    // Check als name null of leeg is " "
    if (!this.category.name || this.category.name.trim() == "") {
      this.errorMessage = `Categorie naam mag niet leeg zijn.`;
      this.isInputValid = false;
    }

    this.existingCategories.forEach(cat => {
        if(cat.name == this.category.name) {
        this.errorMessage = `De categorie: ${this.category.name} bestaat al.`
        this.isInputValid = false;
      }
    })

    if (this.isInputValid) {
          let category = new Category(
      0,
      this.category.name ?? "",
      this.category.description ?? ""
    )
    this.newCategory.emit(category);
    }
  }
}
