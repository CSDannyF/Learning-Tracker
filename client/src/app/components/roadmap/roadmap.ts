import { ChangeDetectorRef, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';

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
  
    const saved = await this.categoryService.addCategory(newCategory)
    this.categories.push(saved);
    this.newCategoryDialog?.nativeElement.close();
    this.cdr.detectChanges();
  }
}