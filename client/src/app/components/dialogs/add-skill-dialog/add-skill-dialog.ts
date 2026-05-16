import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog'
import { MatButtonModule, MatAnchor } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { Skill } from '../../../models/skill';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-skill-dialog',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatDialogContent, MatDialogActions, MatInputModule, MatButtonModule, MatAnchor],
  templateUrl: './add-skill-dialog.html',
  styleUrl: './add-skill-dialog.css',
})
export class AddSkillDialog {
  @Input()
  categoryId!: number;

  @Input()
  existingSkills: Skill[] = [];

  @Output()
  newSkill: EventEmitter<Skill> = new EventEmitter<Skill>;

  @Output()
  closeDialog: EventEmitter<void> = new EventEmitter<void>;

  skill: Partial<Skill> = {};
  isInputValid: boolean= true;
  errorMessage = ``;

  onSubmit() {
    this.isInputValid = true;
    this.errorMessage = ``;

    if (!this.skill.name || this.skill.name?.trim() == "") {
      this.errorMessage = `Skill naam mag niet leef zijn.`;
      this.isInputValid = false;
    }

    if (this.isInputValid) {
      let skill = new Skill(
        0,
        this.skill.name ?? "",
        this.categoryId,
        this.skill.description ?? "",
        []
      )
      this.newSkill.emit(skill);
    }
  }

   onClose(): void {
    this.closeDialog.emit();
   }
}
