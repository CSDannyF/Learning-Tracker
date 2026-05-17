import { Pipe, PipeTransform } from '@angular/core';
import { Topic } from '../models/topic';
import { TopicStatus } from '../models/topic-status';

@Pipe({
  name: 'progress',
})
export class ProgressPipe implements PipeTransform {
  transform(topics: Topic[], ...args: unknown[]): number {
    let topicsDone = topics.filter(t => t.status == TopicStatus.Done).length;
    let percentage = (topicsDone / topics.length )*100;
    if (percentage == Infinity) return 0;
    return percentage;
  }
}
