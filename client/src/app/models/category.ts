import { Skill } from "./skill";

export class Category {
  id: number = 0;
  name: string;
  description?: string;
  skills: Skill[] = [];
  
  constructor(id: number, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.skills = []
  }
}
