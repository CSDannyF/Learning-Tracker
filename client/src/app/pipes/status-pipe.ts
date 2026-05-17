import { Pipe, PipeTransform } from '@angular/core';
import { TopicStatus } from '../models/topic-status';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: TopicStatus, ...args: unknown[]): string {
    switch (value) {
      case TopicStatus.Done:
        return "Topic Done";

      case TopicStatus.InProgress:
        return "Topic in progress";

      case TopicStatus.NotStarted:
        return "Topic is not started";

      case TopicStatus.Paused:
        return "Topic is paused";
        
      default:
        return "Topic has no status"
    }
  }
}
