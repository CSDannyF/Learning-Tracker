import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Topic } from '../../models/topic';
import { Skill } from '../../models/skill';
import { Category } from '../../models/category';
import { TreeNode } from '../../models/tree-node';
import { AddSkillDialog } from "../dialogs/add-skill-dialog/add-skill-dialog";
import { SkillService } from '../../services/skill-service';
import { AddTopicDialog } from "../dialogs/add-topic-dialog/add-topic-dialog";
import { TopicService } from '../../services/topic-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-component',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, AddSkillDialog, MatIconButton, AddTopicDialog, RouterLink],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  constructor(private skillService: SkillService,private topicservice: TopicService , private cdr: ChangeDetectorRef) {}

  @Input()
  category!: Category;

  @Input()
  selectedSkillId: number = 0;

  @ViewChild("newSkillDialog")
  newSkillDialog: ElementRef<HTMLDialogElement> | undefined;

  @ViewChild("newTopicDialog")
  newTopicDialog: ElementRef<HTMLDialogElement> |undefined;

  dataSource: TreeNode[] = [];
  
  childrenAccessor = (node: TreeNode) => node.children ?? [];

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  // Skill en Topic mappen naar TreeNode
  mapSkillToTreeNdode(skill: Skill): TreeNode {
    const node = new TreeNode();
    node.id = skill.id;
    node.name = skill.name;
    node.link = `/roadmap/${skill.id}`;
    node.isSkill = true;

    node.children = skill.topics.map(topic => {
      const topicNode = new TreeNode();
      node.id;
      topicNode.name = topic.name;
      topicNode.isSkill = false
      return topicNode    
    })
    return node;
  }

  ngOnInit() {
    this.dataSource = this.category.skills.map(skill => this.mapSkillToTreeNdode(skill));
  }

  openNewSkillDialog() {
    this.newSkillDialog?.nativeElement.showModal();
  }

  openNewTopicDialog(skillId: number) {
    this.selectedSkillId = skillId;
    this.newTopicDialog?.nativeElement.showModal();
  }
  
  async addNewSkill(newSkill: Skill) {
    const savedSkill = await this.skillService.addSkillToCategory(this.category.id, newSkill);
    this.category.skills.push(savedSkill);
    this.dataSource = this.category.skills.map(skill => this.mapSkillToTreeNdode(skill));
    this.newSkillDialog?.nativeElement.close();
    this.cdr.detectChanges();
  }

  async addNewTopic(newTopic: Topic) {
    this.newTopicDialog?.nativeElement.close();
    const savedTopic = await this.topicservice.addTopicToSkill(this.selectedSkillId, newTopic);
    const skill = this.category.skills.find(skill => skill.id === this.selectedSkillId);
    skill?.topics.push(savedTopic);
    this.dataSource = this.category.skills.map(skill => this.mapSkillToTreeNdode(skill));
    this.newTopicDialog?.nativeElement.close();
    this.cdr.detectChanges();
  }
}


// https://material.angular.dev/components/tree/overview
// Gebruik gemaakt van nested tree