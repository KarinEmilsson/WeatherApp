import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvaluatorPage } from './avaluator.page';

describe('AvaluatorPage', () => {
  let component: AvaluatorPage;
  let fixture: ComponentFixture<AvaluatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvaluatorPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvaluatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
