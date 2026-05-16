export class TreeNode {
  name!: string;
  link?: string;
  children?: TreeNode[];
}

// TreeNode klasse omdat bij mat-tree de parent en children van hetzelfde type moeten zijn. Deze klasse gebruik ik om mijn skill en topic types naar toe te mappen