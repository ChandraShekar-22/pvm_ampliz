import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmplizService } from '../../../services/ampliz.service';

@Component({
	selector: 'app-similar-physician',
	templateUrl: './similar-physician.component.html',
	styleUrls: ['./similar-physician.component.css']
})
export class SimilarPhysicianComponent implements OnInit {
	@Input() name: string = '';
	@Input() hospital: string = '';
	@Input() specialty: string = '';
	@Input() physicianId: string = '';

	constructor(private router: Router) {}

	ngOnInit(): void {}
	onCardClick() {
		this.router.navigate([]).then((result) => {
			window.open(`/physicianOverview/${this.physicianId}`, '_blank');
		});
	}
}
