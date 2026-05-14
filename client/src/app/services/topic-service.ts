import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Topic } from '../models/topic';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) {}

  // Server Get Topics nu skillId
  getTopicsBySkillId$(skillId: number): Observable<Topic[]> {
    return this.http.get<any[]>(`${this.baseUrl}skills/${skillId}/topics`)
    .pipe(map((topicLiteralArray: any[]) => {
      return topicLiteralArray.map(topicLiteral => new Topic(
        topicLiteral.id,
        topicLiteral.skillId,
        topicLiteral.name,
        topicLiteral.status,
        topicLiteral.startDate,
        topicLiteral.notes
      ))
    }));
  }

  // Server Post new Topic by skillId
  addTopicToSkill$(skillId: number, newTopic: Topic): Observable<Topic> {
    return this.http.post<any>(`${this.baseUrl}skills/${skillId}/topics`, newTopic);
  }

  // Server Update Topic by topicId
  updateTopic$(topicId: number, updatedTopic: Topic): Observable<Topic> {
    return this.http.put<any>(`${this.baseUrl}topics/${topicId}`, updatedTopic);
  }

  // Server Delete Topic by id
  deleteTopic$(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}topics/${topicId}`);
  }

  // Server Post Note to Topic
  addNoteToTopic$(topicId: number, newNote: Note): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}topics/${topicId}/notes`, newNote);
  }

  // Server Delete Note from Topic
  deleteNoteFromTopic$(topicId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}topics/${topicId}/notes/${noteId}`);
  }

  // Open Service methods

  getTopicsBySkill(skillId: number): Observable<Topic[]> {
    return this.getTopicsBySkillId$(skillId);
  }

  addTopicToSkill(skillId: number, newTopic: Topic): Observable<Topic> {
    return this.addTopicToSkill$(skillId, newTopic);
  }

  updateTopic(topicId: number, updatedTopic: Topic): Observable<Topic> {
    return this.updateTopic$(topicId, updatedTopic);
  }

  deleteTopic(topicId: number): Observable<void> {
    return this.deleteTopic$(topicId);
  }

  addNoteToTopic(topicId: number, newNote: Note): Observable<Note> {
    return this.addNoteToTopic$(topicId, newNote);
  }

  deleteNoteFromTopic(topicId: number, noteId: number): Observable<void> {
    return this.deleteNoteFromTopic$(topicId, noteId);
  }
}
