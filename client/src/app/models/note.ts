export class Note {
  id: number = 0;
  content: string;
  url?: string;
  date?: Date;

  constructor(id: number, content: string, url?: string, date?: Date) {
    this.id = id;
    this.content = content;
    this.url = url;
    this.date = date;
  }
}
