import { Component, Input, OnInit } from '@angular/core'
import { AmplizService } from '../../../services/ampliz.service'

@Component({
	selector: 'app-similar-physician',
	templateUrl: './similar-physician.component.html',
	styleUrls: ['./similar-physician.component.css'],
})
export class SimilarPhysicianComponent implements OnInit {
	@Input() hospitalName: string = ''
	@Input() hospitalLocation: string = ''

	constructor(private amplizService: AmplizService) {}

	ngOnInit(): void {}
}
