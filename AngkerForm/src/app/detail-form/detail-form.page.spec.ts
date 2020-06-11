import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailFormPage } from './detail-form.page';

describe('DetailFormPage', () => {
  let component: DetailFormPage;
  let fixture: ComponentFixture<DetailFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
