import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs';

import { Skill } from '../models/skill';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) {}

  // Server Get Skills by categoryId
  getSkillsByCategoryId$(categoryId: number): Observable<Skill[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/${categoryId}/skills`)
    .pipe(map((skillLiteralArray: any[]) => {
      return skillLiteralArray.map(skillLiteral => new Skill(
        skillLiteral.id,
        skillLiteral.name,
        skillLiteral.categoryId,
        skillLiteral.description,
        skillLiteral.notes
      ))
    }));
  }

  // Server Post new Skill by categoryId
  addSkillToCategory$(categoryId: number, newSkill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.baseUrl}categories/${categoryId}/skills`, newSkill);
  }

  // Server update Skill by skillId
  updateSkill$(skillId: number, updatedSkill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.baseUrl}skills/${skillId}`, updatedSkill);
  }

  // Server Delete Skill by skillId
  deleteSkill$(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}skills/${skillId}`);
  }

  // Server Add note to skill
  addNoteToSkill$(skillId: number, newNote: Note): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}skills/${skillId}/notes`, newNote);
  }

  // Server Delete note from skill
  deleteNoteFromSkill$(skillId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}skills/${skillId}/notes/${noteId}`);
  }

  // Open Service methods

  getSkillsByCategory(categoryId: number): Observable<Skill[]> {
    return this.getSkillsByCategoryId$(categoryId);
  }

  addSkillToCategory(categoryId: number, newSkill: Skill): Observable<Skill> {
    return this.addSkillToCategory$(categoryId, newSkill);
  }

  updateSkill(skillId: number, updatedSkill: Skill): Observable<Skill> {
    return this.updateSkill$(skillId, updatedSkill);
  }

  deleteSkill(skillId: number): Observable<void> {
    return this.deleteSkill$(skillId);
  }

  addNoteToSkill(skillId: number, note: Note): Observable<Note> {
    return this.addNoteToSkill$(skillId, note);
  }

  deleteNoteFromSkill(skillId: number, noteId: number): Observable<void> {
    return this.deleteNoteFromSkill$(skillId, noteId);
  }
}
