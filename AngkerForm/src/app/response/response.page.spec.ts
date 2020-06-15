import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResponsePage } from './response.page';

describe('ResponsePage', () => {
  let component: ResponsePage;
  let fixture: ComponentFixture<ResponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
