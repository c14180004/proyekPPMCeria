import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewFormPage } from './new-form.page';

describe('NewFormPage', () => {
  let component: NewFormPage;
  let fixture: ComponentFixture<NewFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
