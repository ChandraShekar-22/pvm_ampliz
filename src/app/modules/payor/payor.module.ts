import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayorComponent } from './container/payor/payor.component';
import { PayorCompanyComponent } from './container/payor-company/payor-company.component';
import { PayorExecutiveComponent } from './container/payor-executive/payor-executive.component';
import { PayourCompanyOverviewComponent } from './container/payour-company-overview/payour-company-overview.component';
import { PayourExecutiveOverviewComponent } from './container/payour-executive-overview/payour-executive-overview.component';
import { BulkSavePayorCardComponent } from './components/bulk-save-payor-card/bulk-save-payor-card.component';
import { PayorCardComponent } from './components/payor-card/payor-card.component';
import { PayorCenterCardComponent } from './components/payor-center-card/payor-center-card.component';
import { PayorFilterExecutiveComponent } from './components/payor-filter-executive/payor-filter-executive.component';
import { PayorNotCorrectComponent } from './components/payor-not-correct/payor-not-correct.component';
import { SavePayourModalComponent } from './components/save-payour-modal/save-payour-modal.component';
import { PayorFilterComponent } from './components/payor-filter/payor-filter.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { BasicModule } from '../basic/basic.module';
import { HealthcareModule } from '../healthcare/healthcare.module';
import { LTCModule } from '../LTC/ltc.module';
import { ImagingCenterModule } from '../ImagingCenter/imaging-center.module';

const appRoutes = [
	{
		path: 'payor',
		component: PayorComponent
	},
	{
		path: 'payor/:mcoExecutiveId',
		component: PayourExecutiveOverviewComponent
	},
	{
		path: 'payor-company/:mcoCompanyId',
		component: PayourCompanyOverviewComponent
	}
];

@NgModule({
	declarations: [
		PayorComponent,
		PayorCompanyComponent,
		PayorExecutiveComponent,
		PayourCompanyOverviewComponent,
		PayourExecutiveOverviewComponent,
		BulkSavePayorCardComponent,
		PayorCardComponent,
		PayorCenterCardComponent,
		PayorFilterExecutiveComponent,
		PayorNotCorrectComponent,
		SavePayourModalComponent,
		PayorFilterComponent
	],
	imports: [
		RouterModule.forChild(appRoutes),
		CommonModule,
		NgMultiSelectDropDownModule.forRoot(),
		AgGridModule,
		CommonComponentsModule,
		BasicModule,
		HealthcareModule,
		LTCModule,
		ImagingCenterModule
	]
})
export class PayorModule {}
