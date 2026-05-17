import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DatePipe } from '@angular/common';
import { StatusPipe } from '../../pipes/status-pipe';

import { SkillService } from '../../services/skill-service';
import { Skill } from '../../models/skill';
import { TopicStatus } from '../../models/topic-status';
import { Topic } from '../../models/topic';
import { ProgressPipe } from '../../pipes/progress-pipe';
import { TopicService } from '../../services/topic-service';

@Component({
  selector: 'app-skill-detail',
  imports: [MatCardModule, MatExpansionModule, DatePipe, StatusPipe, MatProgressBarModule, ProgressPipe, MatSelectModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './skill-detail.html',
  styleUrl: './skill-detail.css',
})
export class SkillDetail implements OnInit {
  constructor(private skillService: SkillService, private topicService: TopicService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  skill = signal<Skill | null>(null);
  TopicStatus = TopicStatus;
  isEditing: Map<number, boolean> = new Map();

  isTopicStarted(topic: Topic): boolean {
    return topic.status !== TopicStatus.NotStarted;
  }

  startEditing(topic: Topic) {
    this.isEditing.set(topic.id, true);
  }

  async saveEdit(topic: Topic) {
    await this.topicService.updateTopic(topic.id ,topic);
    this.isEditing.set(topic.id, false);
    this.cdr.detectChanges();
  }

  cancelEdit(topic: Topic) {
    this.isEditing.set(topic.id, false);
  }

  async ngOnInit(): Promise<void> {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    this.skill.set(await this.skillService.getSkillBySkillId(skillId));
  }
}
