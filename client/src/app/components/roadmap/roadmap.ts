import { Component, OnInit } from '@angular/core';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-roadmap',
  imports: [],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css',
})
export class Roadmap implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  async ngOnInit(): Promise<void> {
      this.categories = await this.categoryService.getCategories();
  }
}
