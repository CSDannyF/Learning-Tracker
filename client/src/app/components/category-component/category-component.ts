import { Component, Input, OnInit } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Skill } from '../../models/skill';
import { Category } from '../../models/category';
import { TreeNode } from '../../models/tree-node';

@Component({
  selector: 'app-category-component',
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  @Input()
  category!: Category;

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
    this.dataSource = this.category.skills.map(skill => {
      return this.mapSkillToTreeNdode(skill);
    })
  }
}

// https://material.angular.dev/components/tree/overview
// Gebruik gemaakt van nested tree