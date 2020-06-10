import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IsiFormPage } from './isi-form.page';

describe('IsiFormPage', () => {
  let component: IsiFormPage;
  let fixture: ComponentFixture<IsiFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsiFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IsiFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
