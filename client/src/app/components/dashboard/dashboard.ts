import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { ActivityService } from '../../services/activity-service';
import { Category } from '../../models/category';
import { Activity } from '../../models/activity';
import { TopicStatus } from '../../models/topic-status';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard  implements OnInit {

  constructor(private categoryService: CategoryService, private activityService: ActivityService, private cdr: ChangeDetectorRef) {}

  categories: Category[] = [];
  activities: Activity[]= [];

  topicsInSKill: number = 0;
  totalKnownSkills: number = 0;

  skillsInProgress: number = 0;
  learningStreak: number = 0;

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
    this.activities = await this.activityService.getAllActivities();
    this.calculateTotalKnownSkills();
    this.calculateSkillsInProgress();
    this.calculateLearningStreak();
    this.cdr.detectChanges();
  }

  calculateSkillsInProgress() {
    this.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        if (skill.topics.find(topic => topic.status === TopicStatus.InProgress)) { 
          return this.skillsInProgress++ 
        } else {
          return 
        };
      })
    })
  }

  calculateTotalKnownSkills() {
    this.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        if (skill.topics.length > 0 && skill.topics.every(topic => topic.status === TopicStatus.Done)) this.totalKnownSkills++;
      })
    })
  }

  // Alle activiteiten mappen als string
  // Set verwijderd duplicaten, de spread [...] zet de set om naar een array
  // De vergelijking begint vandaag, we kijken als als deze datum in de lijst zit. Zo ja teller +1 en gaan we 1 dag terug. totdat we geen match hebben, dat is de streak
  calculateLearningStreak() {
    const dateStrings = [...new Set(
      this.activities.map(a => new Date(a.date).toDateString())
    )];

    let today = new Date();

    while (dateStrings.includes(today.toDateString())) {
      this.learningStreak++;
      today.setDate(today.getDate() -1);
    }
  }

}
