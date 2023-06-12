import { NgModule } from '@angular/core';
import { ImagingCenterComponent } from './container/imaging-center/imaging-center.component';
import { FilterImagingCenterComponent } from './component/filter/filter-imaging-center/filter-imaging-center.component';
import { ImagingCardComponent } from './component/cards/imaging-card/imaging-card.component';
import { AppSaveImagingModalComponent } from './component/modals/app-save-imaging-modal/app-save-imaging-modal.component';
import { ImagingNotCorrectComponent } from './component/modals/imaging-not-correct/imaging-not-correct.component';
import { BulkSaveImagingCardComponent } from './component/cards/bulk-save-imaging-card/bulk-save-imaging-card.component';
import { OverviewComponent as ImagingOverview } from './container/imaging-center/overview/overview.component';
import { OverviewComponent as ImagingExecutveOverview } from './container/imaging-center-executive/overview/overview.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { BasicModule } from '../basic/basic.module';
import { ButtoncellrendererComponent } from '../basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { HealthcareModule } from 'src/app/modules/healthcare/healthcare.module';
import { ImagingDataService } from './services/imaging-data.service';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ImagingCenterCardComponent } from './component/cards/imaging-center-card/imaging-center-card.component';
import { FilterImagingCenterExecutivesComponent } from './component/filter/filter-imaging-center-executives/filter-imaging-center-executives.component';
import { IcContainerComponent } from './container/ic-container/ic-container.component';
import { ImagingCenterExecutiveComponent } from './container/imaging-center-executive/imaging-center-executive.component';

const appRoutes = [
  {
    path: 'imaging',
    component: IcContainerComponent,
  },
  {
    path: 'imaging/:ImagingCenterId',
    component: ImagingOverview,
  },
  {
    path: 'imagingOverview/:icExecutiveId',
    component: ImagingExecutveOverview,
  },
];
@NgModule({
  declarations: [
    ImagingCenterComponent,
    FilterImagingCenterComponent,
    ImagingCardComponent,
    AppSaveImagingModalComponent,
    ImagingNotCorrectComponent,
    BulkSaveImagingCardComponent,
    ImagingOverview,
    ImagingExecutveOverview,
    ImagingCenterCardComponent,
    FilterImagingCenterExecutivesComponent,
    IcContainerComponent,
    ImagingCenterExecutiveComponent,
  ],
  imports: [
    CommonComponentsModule,
    BasicModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(appRoutes),
    HealthcareModule,
    AgGridModule,
    // AgGridModule.withComponents([ButtoncellrendererComponent]),
  ],
  exports: [
    ImagingCenterComponent,
    FilterImagingCenterComponent,
    ImagingCardComponent,
    AppSaveImagingModalComponent,
    ImagingNotCorrectComponent,
    BulkSaveImagingCardComponent,
    ImagingOverview,
    ImagingExecutveOverview,
  ],
  providers: [ImagingDataService],
})
export class ImagingCenterModule {}
