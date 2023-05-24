import { NgModule } from '@angular/core';
import { BasicModule } from '../basic/basic.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatRadioModule } from '@angular/material/radio';
import { ButtoncellrendererComponent } from '../basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { PhysicanPageComponent } from './containers/physican/physican.component';
import { PhysicanImageComponent } from './component/cards/physican-image/physican-image.component';
import { ListsComponent } from './containers/lists/lists.component';
import { ListdetailsComponent } from './containers/lists/listdetails/listdetails.component';
import { FilterPhysicianComponent } from './component/filters/filter-physician/filter-physician.component';
import { SavelistComponent } from './containers/physican/savelist/savelist.component';
import { MaskedemailPipe } from './pipe/maskedemail.pipe';
import { MaskmobilePipe } from './pipe/maskmobile.pipe';
import { ExecutivePageComponent } from './containers/executive-page/executive-page.component';
import { PhysicianOverviewComponent } from './containers/physician-overview/physician-overview.component';
import { ExecutiveOverviewComponent } from './containers/executive-overview/executive-overview.component';
import { HospitalComponent } from './containers/hospital/hospital/hospital.component';
import { HospitalcardComponent } from './containers/hospital/hospitalcard/hospitalcard.component';
import { NotcorrectComponent } from './containers/physican/notcorrect/notcorrect.component';
import { ListfilterComponent } from './containers/lists/listfilter/listfilter.component';
import { HospitalOverviewComponent } from './containers/hospital-overview/hospital-overview.component';
import { FilterHospitalComponent } from './component/filters/filter-hospital/filter-hospital.component';
import { FilterExecutiveComponent } from './component/filters/filter-executive/filter-executive.component';
import { StartcasePipe } from './pipe/startcase.pipe';
import { FilterPipe } from './pipe/filter.pipe';
import { NotcorrectHospitalComponent } from './containers/hospital/notcorrect/notcorrect.component';
import { NumberDirective } from './directives/numbers-only.directive';
import { HealthcareonboardComponent } from './containers/healthcareonboard/healthcareonboard.component';
import { ApisComponent } from './apis/apis.component';
import { HcdashboardComponent } from './containers/hcdashboard/hcdashboard.component';
import { PaginationUpgradeComponent } from '../basic/component/pagination-upgrade/pagination-upgrade.component';
import { HcpricingComponent } from './containers/hcpricing/hcpricing.component';
import { FilterMytabComponent } from './component/filters/filter-mytab/filter-mytab.component';
import { HcPaymentComponent } from './containers/hc-payment/hc-payment.component';
import { SavePhycisianModalComponent } from './containers/physican/save-phycisian-modal/save-phycisian-modal.component';
import { SaveExecutiveModalComponent } from './containers/executive-page/save-executive-modal/save-executive-modal.component';
import { PhysicianFilterComponent } from './component/filters/physician-filter/physician-filter.component';
import { MyTabComponent } from './containers/my-tab/my-tab.component';
import { PhysicianGuard } from './services/physician.guard';
import { DomainsearchComponent } from './containers/domainsearch/domainsearch.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ConfidenceLevelComponent } from './component/confidence-level/confidence-level.component';
import { NpiLookupComponent } from './containers/npi-lookup/npi-lookup.component';
import { NpiDataCardComponent } from './containers/npi-data-card/npi-data-card.component';
import { NpiActionsComponent } from './component/npi-actions/npi-actions.component';
import { NpiListComponent } from './component/npi-list/npi-list.component';
import { NpiFilterDropDownComponent } from './component/npi-filter-drop-down/npi-filter-drop-down.component';
import { NpiFileUploadComponent } from './component/npi-file-upload/npi-file-upload.component';
import { NpiDowloadListComponent } from './component/npi-dowload-list/npi-dowload-list.component';
import { NpiCriteriaComponent } from './component/npi-criteria/npi-criteria.component';
import { NpiDownloadAgainComponent } from './component/npi-download-again/npi-download-again.component';
import { NpiCustomDataComponent } from './component/npi-custom-data/npi-custom-data.component';

import { NpiListLoaderComponent } from './component/npi-list-loader/npi-list-loader.component';
import { NpiTableStatusComponent } from './component/npi-table-status/npi-table-status.component';
import { NpiDataProgressModalComponent } from './component/npi-data-progress-modal/npi-data-progress-modal.component';
// component/confidence-level/confidence-level.component
const appRoutes = [
  {
    path: 'hconboard',
    component: HealthcareonboardComponent,
    canActivate: [PhysicianGuard],
  },
  {
    path: 'hcdashboard',
    component: HcdashboardComponent,
  },
  {
    path: 'company_search',
    component: DomainsearchComponent,
  },
  {
    path: 'physician',
    component: PhysicanPageComponent,
    canActivate: [PhysicianGuard],
  },
  {
    path: 'mytab',
    component: MyTabComponent,
  },
  {
    path: 'physicianOverview/:physicianId',
    component: PhysicianOverviewComponent,
  },
  {
    path: 'executiveOverview/:executiveId',
    component: ExecutiveOverviewComponent,
  },
  {
    path: 'executive',
    component: ExecutivePageComponent,
  },
  {
    path: 'hospital',
    component: HospitalComponent,
  },
  {
    path: 'lists',
    component: ListsComponent,
  },
  {
    path: 'lists/:listId',
    component: ListdetailsComponent,
  },
  {
    path: 'hospitalOverView/:hospitalId',
    component: HospitalOverviewComponent,
  },
  {
    path: 'hcpayment',
    component: HcPaymentComponent,
  },
  {
    path: 'hcupgrade',
    component: HcpricingComponent,
  },
  {
    path: 'apis',
    component: ApisComponent,
  },
  {
    path: 'geneateapi',
    component: ApisComponent,
  },
  {
    path: 'npi-lookup',
    component: NpiLookupComponent,
  },
  {
    path: 'npi-data-card/:bulkNpiId',
    component: NpiDataCardComponent,
  },
];
@NgModule({
  declarations: [
    PhysicanPageComponent,
    PhysicanImageComponent,
    ListsComponent,
    ListdetailsComponent,
    FilterPhysicianComponent,
    SavelistComponent,
    MaskedemailPipe,
    MaskmobilePipe,
    ExecutivePageComponent,
    PhysicianOverviewComponent,
    ExecutiveOverviewComponent,
    HospitalComponent,
    HospitalcardComponent,
    NotcorrectComponent,
    ListfilterComponent,
    HospitalOverviewComponent,
    FilterHospitalComponent,
    FilterExecutiveComponent,
    StartcasePipe,
    FilterPipe,
    NotcorrectHospitalComponent,
    NumberDirective,
    HealthcareonboardComponent,
    HcdashboardComponent,
    PaginationUpgradeComponent,
    HcpricingComponent,
    HcPaymentComponent,
    SavePhycisianModalComponent,
    SaveExecutiveModalComponent,
    PhysicianFilterComponent,
    MyTabComponent,
    FilterMytabComponent,
    DomainsearchComponent,
    ConfidenceLevelComponent,
    NpiLookupComponent,
    NpiDataCardComponent,
    NpiListComponent,
    NpiActionsComponent,
    NpiFilterDropDownComponent,
    NpiFileUploadComponent,
    NpiDowloadListComponent,
    NpiCriteriaComponent,
    NpiDownloadAgainComponent,
    NpiCustomDataComponent,
    NpiListLoaderComponent,
    NpiTableStatusComponent,
    NpiDataProgressModalComponent,
  ],
  imports: [
    CommonComponentsModule,
    BasicModule,
    MatRadioModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule,
    RouterModule.forChild(appRoutes),
  ],
  exports: [
    PhysicanPageComponent,
    PhysicanImageComponent,
    ListsComponent,
    ListdetailsComponent,
    FilterPhysicianComponent,
    SavelistComponent,
    MaskedemailPipe,
    MaskmobilePipe,
    ExecutivePageComponent,
    PhysicianOverviewComponent,
    ExecutiveOverviewComponent,
    HospitalComponent,
    HospitalcardComponent,
    NotcorrectComponent,
    ListfilterComponent,
    HospitalOverviewComponent,
    FilterHospitalComponent,
    FilterExecutiveComponent,
    StartcasePipe,
    FilterPipe,
    NotcorrectHospitalComponent,
    NumberDirective,
    HealthcareonboardComponent,
    HcdashboardComponent,
    PaginationUpgradeComponent,
    HcpricingComponent,
    HcPaymentComponent,
    SavePhycisianModalComponent,
    SaveExecutiveModalComponent,
    PhysicianFilterComponent,
    MyTabComponent,
    FilterMytabComponent,
    NpiLookupComponent,
    NpiDataCardComponent,
  ],
})
export class HealthcareModule {}
