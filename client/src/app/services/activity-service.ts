import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom } from 'rxjs';
import { Activity } from '../models/activity';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private baseUrl = 'http://localhost:3000/api/'


  constructor(private http: HttpClient) {}

  // Server Get all Activities
  getAllActivities$(): Observable<Activity[]> {
    return this.http.get<any[]>(`${this.baseUrl}activities`)
    .pipe(map((activityLiteralArray: any[]) => {
      return activityLiteralArray.map(activityLiteral => new Activity(
        activityLiteral.id,
        activityLiteral.skillId,
        activityLiteral.type,
        activityLiteral.topicId,
        activityLiteral.newStatus,
        activityLiteral.date
      ));
    }));
  }

  // Server Post new Activity
  addNewActivity$(activity: Activity): Observable<Activity> {
    return this.http.post<any>(`${this.baseUrl}activities`, activity);
  }

  getAllActivities(): Promise<Activity[]> {
    return firstValueFrom(this.getAllActivities$());
  }

  addNewActivity(activity: Activity): Promise<Activity> {
    return firstValueFrom(this.addNewActivity$(activity));
  }
}
