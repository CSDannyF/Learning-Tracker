import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDetail } from './skill-detail';

describe('SkillDetail', () => {
  let component: SkillDetail;
  let fixture: ComponentFixture<SkillDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
