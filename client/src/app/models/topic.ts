import { Note } from "./note";
import { TopicStatus } from "./topic-status";

export class Topic {
  id: number = 0;
  skillId: number;
  name: string;
  status: TopicStatus;
  startDate?: Date;
  endDate?: Date;
  notes?: Note[];

  constructor(id: number, skillId: number, name: string, status: TopicStatus, startDate?: Date, endDate?: Date, notes?: Note[]) {
    this.id = id;
    this.skillId = skillId;
    this.name = name;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.notes = notes;
  }
}
