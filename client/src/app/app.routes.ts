import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Roadmap } from './components/roadmap/roadmap';
import { SkillDetail } from './components/skill-detail/skill-detail';

export const routes: Routes = [
  { path: "dashboard", component: Dashboard },
  { path: "roadmap", component: Roadmap },
  { path: "skill-detail", component: SkillDetail }
];
