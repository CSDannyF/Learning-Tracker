import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillDialog } from './add-skill-dialog';

describe('AddSkillDialog', () => {
  let component: AddSkillDialog;
  let fixture: ComponentFixture<AddSkillDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkillDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSkillDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
