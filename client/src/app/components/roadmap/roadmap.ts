import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';
import { CategoryComponent } from "../category-component/category-component";
import { MatAnchor } from "@angular/material/button";
import { AddCategoryDialog } from "../dialogs/add-category-dialog/add-category-dialog";

@Component({
  selector: 'app-roadmap',
  imports: [CategoryComponent, MatAnchor, AddCategoryDialog],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css',
})
export class Roadmap implements OnInit {

  categories: Category[] = [];

  @ViewChild("newCategoryDialog")
  newCategoryDialog: ElementRef<HTMLDialogElement> | undefined;

  isNameAvailable: boolean = true;
  newCategory!: Category;

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
      this.categories = await this.categoryService.getCategories();
      this.cdr.detectChanges();
  }

  openNewCategoryDialog(): void {
    this.newCategoryDialog?.nativeElement.showModal();
  }

  async addNewCategory(newCategory: Category) {
    const savedCategory = await this.categoryService.addCategory(newCategory)
    this.categories.push(savedCategory);
    this.newCategoryDialog?.nativeElement.close();
    this.cdr.detectChanges();
  }

  async onDeleteCategory(categoryId: number) {
    if (confirm('Ben je zeker dat je deze category wil verwijderen?')) {
      await this.categoryService.deleteCategory(categoryId);
      this.categories = this.categories.filter(c => c.id !== categoryId);
      this.cdr.detectChanges();
    }
  }
}