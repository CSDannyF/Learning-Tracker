import { ActivityType } from "./activity-type";
import { TopicStatus } from "./topic-status";

export class Activity {
  id: number = 0;
  date: Date;
  skillId: number;
  topicId?: number;
  newStatus?: TopicStatus;
  type: ActivityType;

  constructor(id: number, skillId: number, type: ActivityType, topicId?: number, newStatus?: TopicStatus, date: Date = new Date()) {
    this.id = id;
    this.date = date;
    this.skillId = skillId;
    this.topicId = topicId;
    this.newStatus = newStatus;
    this.type = type;
  }
}
