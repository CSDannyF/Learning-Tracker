import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Category } from '../models/category';
import { SkillService } from './skill-service';
import { TopicService } from './topic-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient, private skillService: SkillService, private topicService: TopicService) {}

   getCategories$(): Observable<Category[]> {
      return this.http.get<any[]>(this.url)
      .pipe(map((categoryLiteralArray: any[]) => {
        return categoryLiteralArray.map(categoryLiteral => new Category(
          categoryLiteral.id,
          categoryLiteral.name,
          categoryLiteral.description
        ))
      }));
    }
  
    addCategory$(newCategory: Category): Observable<Category> {
      return this.http.post<Category>(this.url, newCategory);
    }
  
    updateCategory$(id: number, updatedCategory: Category): Observable<Category> {
      return this.http.put<Category>(`${this.url}/${id}`, updatedCategory);
    }
  
    deleteCategory$(id: number): Observable<void> {
      return this.http.delete<void>(`${this.url}/${id}`);
    }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  async getCategories(): Promise<Category[]> {
    let categories = await firstValueFrom(this.getCategories$())
    await Promise.all(categories.map(async category => {
      let skills = await this.skillService.getSkillsByCategory(category.id);

      await Promise.all(skills.map(async skill => {
        let topics= await this.topicService.getTopicsBySkill(skill.id);
        skill.topics = topics;
      }))
      category.skills = skills
    }))

    categories.forEach(category => {
      console.log(category.name);
      category.skills.forEach(skill => {
        console.log(" -  " + skill.name);
        skill.topics.forEach(topic => {
          console.log(" - -  " + topic.name);
        })
      })
    })

    return categories//firstValueFrom(this.getCategories$());
  }

  addCategory(newCategory: Category): Promise<Category> {
    return firstValueFrom(this.addCategory$(newCategory));
  }

  updateCategory(id: number, updatedCategory: Category): Promise<Category> {
    return firstValueFrom(this.updateCategory$(id, updatedCategory));
  }

  deleteCategory(id: number): Promise<void> {
    return firstValueFrom(this.deleteCategory$(id))
  }
}
