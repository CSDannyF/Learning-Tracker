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
import { Note } from '../../models/note';
import { Activity } from '../../models/activity';
import { ActivityType } from '../../models/activity-type';
import { ActivityService } from '../../services/activity-service';

@Component({
  selector: 'app-skill-detail',
  imports: [MatCardModule, MatExpansionModule, DatePipe, StatusPipe, MatProgressBarModule, ProgressPipe, MatSelectModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './skill-detail.html',
  styleUrl: './skill-detail.css',
})
export class SkillDetail implements OnInit {
  constructor(private skillService: SkillService, private topicService: TopicService, private activityService: ActivityService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  skill = signal<Skill | null>(null);
  TopicStatus = TopicStatus;

  // De maps dienen om in de lijst van topics de juiste topic via topic.id inline te editten of toevoegen van een Note. De bijhorende boolean gaat in de template ervoor zorgen dat de tekstvelden veranderd worden naar input velden. of skill en skill.id
  isEditing: Map<number, boolean> = new Map();
  isAddingNoteToTopic: Map<number, boolean> = new Map();
  isAddingNoteToSkill: Map<number, boolean> = new Map();

  // OriginalStatus houdt bij als tijdens de edit van de topic de status veranderd word. Indien deze veranderd word, word er een activiteit aangemaakt
  originalStatus: Map<number, TopicStatus> = new Map();
  workedOnTopicToday = signal(new Set<number>());

  newNote: Partial<Note> = {};
  isInputValid: boolean = true;
  errorMessage = ``;

  // Controleerd als een topic al gestard is. Indien niet heeft deze geen startDatum en gaat deze ook niet getoond worden
  isTopicStarted(topic: Topic): boolean {
    return topic.status !== TopicStatus.NotStarted;
  }

  isTopicDone(topic: Topic): boolean {
    return topic.status == TopicStatus.Done;
  }

  // Start aanpassen Topic via inline editing
  startEditing(topic: Topic) {
    this.originalStatus.set(topic.id, topic.status);
    this.isEditing.set(topic.id, true);
  }

  // Aangepaste edit van Skill opslaan
  async saveEdit(topic: Topic) {
    if (topic.status != this.originalStatus.get(topic.id)) {
      const activity = new Activity(
        0,
        topic.skillId,
        ActivityType.StatusChanged,
        topic.id,
        topic.status,
        new Date()
      );
      await this.activityService.addNewActivity(activity);
    }
    await this.topicService.updateTopic(topic.id ,topic);
    this.isEditing.set(topic.id, false);
    //this.isAddingNote.delete(topic.id);
    this.cdr.detectChanges();
  }

  // stoppen Edit Topic
  cancelEdit(topic: Topic) {
    this.isEditing.set(topic.id, false);
    //this.isAddingNote.delete(topic.id);
    this.isInputValid = true;
    this.errorMessage = ``;
  }

  // Note opslaan bij topic
  saveTopicNote(topic: Topic) {
    this.isInputValid = true;
    this.errorMessage = ``;

    if (!this.newNote.content || this.newNote.content?.trim() == "") {
      this.errorMessage = "Content mag niet leeg zijn.";
      this.isInputValid = false;
    } else {
      let note = new Note(
        0,
        this.newNote.content ?? "",
        this.newNote.url ?? ""
      )
      this.topicService.addNoteToTopic(topic.id, note);
      this.isAddingNoteToTopic.delete(topic.id);
      this.cdr.detectChanges();
    }
  }

  // Stoppen met toevoegen Note
  cancelTopicNote(topic: Topic) {
    this.isAddingNoteToTopic.delete(topic.id);
  }

  // Start toevoegen Note
  createTopicNote(topic: Topic) {
    this.isAddingNoteToTopic.set(topic.id, true);
  }

  saveSkillNote(skill: Skill) {
    this.isInputValid = true;
    this.errorMessage = ``;

    if (!this.newNote.content || this.newNote.content?.trim() == "") {
      this.errorMessage = "Content mag niet leeg zijn.";
      this.isInputValid = false;
    } else {
      let note = new Note(
        0,
        this.newNote.content ?? "",
        this.newNote.url ?? ""
      )
      this.skillService.addNoteToSkill(skill.id, note);
      this.isAddingNoteToSkill.delete(skill.id);
      this.cdr.detectChanges();
    }
  }

  cancelSkillNote(skill: Skill) {
    this.isAddingNoteToSkill.delete(skill.id);
  }

  createSkillNote(skill: Skill) {
    this.isAddingNoteToSkill.set(skill.id, true);
  }

  // Activiteit toevoegen WorkedOn
  async workedOnTopic(topic: Topic) {
    if (this.workedOnTopicToday().has(topic.id)) return;

    const activity = new Activity(
      0,
      topic.skillId,
      ActivityType.WorkedOn,
      topic.id,
      topic.status,
      new Date()
    );
    
    if (topic.status === TopicStatus.NotStarted || topic.status === TopicStatus.Paused) {
      topic.status = TopicStatus.InProgress;
      topic.startDate = new Date();
      this.topicService.updateTopic(topic.id, topic);
    }

    await this.activityService.addNewActivity(activity);
    this.workedOnTopicToday().add(topic.id);
    this.cdr.detectChanges();
  }

  async deleteTopic(topic: Topic) {
    if (confirm(`Ben je zeker dat je "${topic.name}" wil verwijderen?`)) {
      await this.topicService.deleteTopic(topic.id);
      const index = this.skill()!.topics.findIndex(t => t.id === topic.id);
      this.skill()!.topics.splice(index, 1);
      // skill opnieuw setten, anders geen refresh op de UI
      this.skill.set(await this.skillService.getSkillBySkillId(topic.skillId));
    }
  }

  async ngOnInit(): Promise<void> {
    const skillId = Number(this.route.snapshot.paramMap.get('skillId'));
    this.skill.set(await this.skillService.getSkillBySkillId(skillId));

    const activities = await this.activityService.getAllActivities();
    const today = new Date().toDateString();
    const newSet = new Set<number>();

    // Alle activiteiten filteren met de datum van vandaag.
    // Enkel de topic waar vandaag geen activiteit van is, kunnen geregistreerd worden als worked-on (ActivityType).
    // Indien deze al een ActivityType worked-on hebben word de knop waarmee je dit registreerd disabled in de FE via de workedOnTopicToday Set. Deze houdt de topicId's bij van de activities waar aan gewerkt is.
    activities
      .filter(a => new Date(a.date).toDateString() === today && a.type === ActivityType.WorkedOn)
      .forEach(a => newSet.add(a.topicId!));

      // oude set overschrijven met een nieuwe want anders is de knop niet disabled bij een refresh van de pagina
      this.workedOnTopicToday.set(newSet);
  }
}

// signals automatische update,
//https://dev.to/codewithrajat/angular-signals-not-updating-heres-why-and-how-to-fix-it-with-real-solutions-4po1
