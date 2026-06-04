import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule, MatAnchor } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Topic } from '../../../models/topic';
import { TopicStatus } from '../../../models/topic-status';

@Component({
  selector: 'app-add-topic-dialog',
  imports: [FormsModule, MatDialogContent, MatDialogActions, MatButtonModule, MatAnchor, MatFormFieldModule, MatInputModule],
  templateUrl: './add-topic-dialog.html',
  styleUrl: './add-topic-dialog.css',
})
export class AddTopicDialog {
  @Input()
  skillId!: number;

  @Output()
  newTopic: EventEmitter<Topic> = new EventEmitter<Topic>;

  @Output()
  closeDialog: EventEmitter<void> = new EventEmitter<void>;

  topic: Partial<Topic> = {};
  isInputValid: boolean = true;
  errorMessage = ``;

  onSubmit() {
    this.isInputValid = true;
    this.errorMessage = ``;

    if (!this.topic.name || this.topic.name?.trim() == "") {
      this.errorMessage = `Topic can not be empty.`;
      this.isInputValid = false;
    } else {
      let topic = new Topic(
        0,
        this.skillId,
        this.topic.name ?? "",
        this.topic.status = TopicStatus.NotStarted
      )
      this.newTopic.emit(topic);
      this.errorMessage = ''
       this.topic = {}
    }
  }

  onClose() {
    this.closeDialog.emit();
  }
}
