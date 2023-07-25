import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BasicService } from 'src/app/modules/basic/service/basic.service';
import { DataService } from 'src/app/modules/basic/service/data.service';
import { MessageService } from 'src/app/modules/B2B/services/message.service';

@Component({
	selector: 'app-permissions',
	templateUrl: './permissions.component.html',
	styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
	userInfo: any;

	isDownload: boolean = false;

	orgId = localStorage.getItem('organizationId');

	params: any = {
		organizationId: this.orgId,
		email: '',
		isDownload: false
	};

	showSavebtn: boolean = false;

	constructor(private api: BasicService, private service: DataService, private message: MessageService) {}

	async ngOnInit() {
		await this.service.getUserInfo().subscribe((value) => {
			this.userInfo = value;
			this.isDownload = this.userInfo.isDownload;
		});
	}

	onCancel() {
		this.isDownload = this.userInfo.isDownload;
		this.showSavebtn = false;
	}

	onSubmit() {
		this.params = {
			organizationId: this.orgId,
			email: this.userInfo.email,
			isDownload: this.isDownload
		};
		this.api.setIsDownload(this.params).subscribe((res) => {
			this.showSavebtn = false;
			this.userInfo.isDownload = this.isDownload;
			this.service.setUserInfo(this.userInfo);
			this.message.display(true, 'Permissions Updated');
		});
	}

	onChange(type: any) {
		if (this.isDownload !== this.userInfo.isDownload) {
			this.showSavebtn = true;
		} else {
			this.showSavebtn = false;
		}
	}
}
