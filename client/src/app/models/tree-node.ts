export class TreeNode {
  id!: number;
  name!: string;
  link?: string;
  children?: TreeNode[];
  isSkill?: boolean;
}

// TreeNode klasse omdat bij mat-tree de parent en children van hetzelfde type moeten zijn. Deze klasse gebruik ik om mijn skill en topic types naar toe te mappen