import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPanleComponent } from './confirm-panel.component';

describe('ConfirmPanleComponent', () => {
	let component: ConfirmPanleComponent;
	let fixture: ComponentFixture<ConfirmPanleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConfirmPanleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmPanleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
