import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DatePipe } from '@angular/common';
import { StatusPipe } from '../../pipes/status-pipe';

import { SkillService } from '../../services/skill-service';
import { Skill } from '../../models/skill';
import { TopicStatus } from '../../models/topic-status';
import { Topic } from '../../models/topic';
import { ProgressPipe } from '../../pipes/progress-pipe';

@Component({
  selector: 'app-skill-detail',
  imports: [MatCardModule, MatExpansionModule, DatePipe, StatusPipe, MatProgressBarModule, ProgressPipe],
  templateUrl: './skill-detail.html',
  styleUrl: './skill-detail.css',
})
export class SkillDetail implements OnInit {
  constructor(private skillService: SkillService ,private route: ActivatedRoute) {}

  skill = signal<Skill | null>(null);

  isTopicStarted(topic: Topic): boolean {
    return topic.status !== TopicStatus.NotStarted;
  }


  async ngOnInit(): Promise<void> {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    this.skill.set(await this.skillService.getSkillBySkillId(skillId));
  }
}
