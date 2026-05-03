import { Note } from "./note";
import { Topic } from "./topic";

export class Skill {
  id: number = 0;
  name: string;
  categoryId: number;
  description: string;
  notes: Note[] = [];
  topics: Topic[] = [];

  constructor(id: number = 0, name: string, categoryId: number, description: string, notes: Note[], topics: Topic[]) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.description = description;
    this.notes = notes;
    this.topics = topics;
  }
}
