import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { DataTablesModule } from "angular-datatables";
import { SplashscreenComponent } from "./modules/basic/component/splashscreen/splashscreen.component";
import { AmplizService } from "./modules/healthcare/services/ampliz.service";
import { FilterStorageService } from "./modules/healthcare/services/filter-storage.service";
import { ErrorService } from "./modules/healthcare/services/error.service";
import { SuccessmessageService } from "./modules/healthcare/services/successmessage.service";
import { LoaderService } from "./modules/healthcare/services/loader.service";
import { NgApexchartsModule } from "ng-apexcharts";
import { FormlyModule } from "@ngx-formly/core";
import { PaginationService } from "./modules/healthcare/services/pagination.service";
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ProgressBarModule } from "angular-progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from "@angular/material/sidenav";
import { AgGridModule } from "ag-grid-angular";
import { MatTabsModule } from "@angular/material/tabs";
import { TokenInterceptor } from "./interceptors/token-interceptor";
import { MatMenuModule } from "@angular/material/menu";
import { IconsModule } from "./modules/basic/icons/feather/icons.module";
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips'
import {MatIconModule} from '@angular/material/icon'
import {MatStepperModule} from '@angular/material/stepper'
import {MatInputModule} from '@angular/material/input'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { TagInputModule } from "ngx-chips";
import { CookieService } from "ngx-cookie-service";
import { HighchartsChartModule } from "highcharts-angular";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { ApisComponent } from "./modules/healthcare/apis/apis.component";
import { ButtoncellrendererComponent } from "./modules/basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component";
import { MatCardModule } from '@angular/material/card';
import { NgOtpInputModule } from 'ng-otp-input';

import { ErrorInterceptorService } from "./modules/healthcare/services/error-interceptor.service";

// import { B2bGlobalModule } from "./modules/B2BGlobal/b2b-global.module";
import { B2bModule } from "./modules/B2B/b2b.module";
import { BasicModule } from "./modules/basic/basic.module";
import { HealthcareModule } from "./modules/healthcare/healthcare.module";
import { ImagingCenterModule } from "./modules/ImagingCenter/imaging-center.module";
import { LTCModule } from "./modules/LTC/ltc.module";
import { CommonComponentsModule } from "./modules/common-components/common-components.module";

const appRoutes: Routes = [
  {
    path: "",
    component: SplashscreenComponent,
  },
  {
    path: "basic",
    loadChildren: () => import('./modules/basic/basic.module').then(m => m.BasicModule),
  },
  {
    path: "hc",
    loadChildren: () => import('./modules/healthcare/healthcare.module').then(m => m.HealthcareModule),
  },
  {
    path: "b2b",
    loadChildren: () => import('./modules/B2B/b2b.module').then(m => m.B2bModule),
  },

  {
    path: "imaging",
    loadChildren: () => import('./modules/ImagingCenter/imaging-center.module').then(m => m.ImagingCenterModule),

  },
  // {
  //   path: "imagingOverview/:ImagingCenterId",
  //   component: imagingCenterExecutiv,
  // },
  {
    path: "ltc",
    loadChildren: () => import('./modules/LTC/ltc.module').then(m => m.LTCModule),

  },
  {
    path: "**",
    component: SplashscreenComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SplashscreenComponent,
    ApisComponent,
  ],
  imports: [
    CommonComponentsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    FormlyModule.forRoot({
      validationMessages: [
        { name: "required", message: "This field is required" },
      ],
    }),
    AgGridModule.withComponents([ButtoncellrendererComponent]),
    NgMultiSelectDropDownModule.forRoot(),
    B2bModule,
    BasicModule,
    HealthcareModule,
    ImagingCenterModule,
    LTCModule
  ],
  providers: [
    AmplizService,
    LoaderService,
    SuccessmessageService,
    ErrorService,
    CookieService,
    MatSidenavModule,
    PaginationService,
    FilterStorageService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
