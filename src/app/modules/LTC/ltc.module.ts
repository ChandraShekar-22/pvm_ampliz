import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LtcCardComponent } from './component/cards/ltc-card/ltc-card.component';
import { BulkSaveLtcCardComponent } from './component/cards/bulk-save-ltc-card/bulk-save-ltc-card.component';
import { SaveLtcModalComponent } from './component/modals/save-ltc-modal/save-ltc-modal.component';
import { LtcNotCorrectComponent } from './component/modals/ltc-not-correct/ltc-not-correct.component';
import { LtcComponent } from './container/ltc/ltc.component';
import { OverviewComponent as ltcOverview } from './container/ltc/overview/overview.component'
import { FilterLtcComponent } from './component/filter/filter-ltc/filter-ltc.component';



import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'
import { NgOtpInputModule } from 'ng-otp-input';
import { IconsModule } from '../basic/icons/feather/icons.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { RouterModule } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ProgressBarModule } from 'angular-progress-bar';
import { HighchartsChartModule } from 'highcharts-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TagInputModule } from 'ngx-chips';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { BasicModule } from '../basic/basic.module';
import { ButtoncellrendererComponent } from '../basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { HealthcareModule } from '../healthcare/healthcare.module';
import { LTCDataService } from './services/ltc-data.service';
import { CommonComponentsModule } from '../common-components/common-components.module';

const appRoutes = [
  {
    path: "ltc",
    component: LtcComponent,
  },
  {
    path: "ltc/:ltcExecutiveId",
    component: ltcOverview,
  },
];
@NgModule({
  declarations: [
    LtcCardComponent,
    BulkSaveLtcCardComponent,
    SaveLtcModalComponent,
    LtcNotCorrectComponent,
    LtcComponent,
    ltcOverview,
    FilterLtcComponent,

  ],
  imports: [
    CommonComponentsModule,
    BasicModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([ButtoncellrendererComponent]),
    RouterModule.forChild(appRoutes),
    HealthcareModule
  ],
  exports: [
    LtcCardComponent,
    BulkSaveLtcCardComponent,
    SaveLtcModalComponent,
    LtcNotCorrectComponent,
    LtcComponent,
    ltcOverview,
    FilterLtcComponent,
  ],
  providers: [
    LTCDataService
  ]
})
export class LTCModule { }
