import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Skill } from '../../models/skill';
import { Category } from '../../models/category';
import { TreeNode } from '../../models/tree-node';
import { AddSkillDialog } from "../dialogs/add-skill-dialog/add-skill-dialog";
import { SkillService } from '../../services/skill-service';

@Component({
  selector: 'app-category-component',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, AddSkillDialog, MatIconButton],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  constructor(private skillService: SkillService, private cdr: ChangeDetectorRef) {}

  @Input()
  category!: Category;

  @ViewChild("newSkillDialog")
  newSkillDialog: ElementRef<HTMLDialogElement> | undefined;

  dataSource: TreeNode[] = [];
  
  childrenAccessor = (node: TreeNode) => node.children ?? [];

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  // Skill en Topic mappen naar TreeNode
  mapSkillToTreeNdode(skill: Skill): TreeNode {
    const node = new TreeNode();
    node.name = skill.name;
    node.link = `/roadmap/${skill.id}`;

    node.children = skill.topics.map(topic => {
      const topicNode = new TreeNode();
      topicNode.name = topic.name;
      return topicNode    
    })
    return node;
  }

  ngOnInit(): void {
    this.dataSource = this.category.skills.map(skill => this.mapSkillToTreeNdode(skill));
  }

  openNewSkillDialog(): void {
    this.newSkillDialog?.nativeElement.showModal();
  }
  
  async addNewSkill(newSkill: Skill) {
    const savedSkill = await this.skillService.addSkillToCategory(this.category.id, newSkill);
    this.category.skills.push(savedSkill);
    this.dataSource = this.category.skills.map(skill => this.mapSkillToTreeNdode(skill));
    this.newSkillDialog?.nativeElement.close();
    this.cdr.detectChanges();
}
}


// https://material.angular.dev/components/tree/overview
// Gebruik gemaakt van nested tree