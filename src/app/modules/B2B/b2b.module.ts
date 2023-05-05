import { NgModule } from '@angular/core';
import { SavedNoDataComponent } from './component/search-components/saved-view-more/saved-no-data/saved-no-data.component';
import { RecentNoDataComponent } from './component/search-components/recent-view-more/recent-no-data/recent-no-data.component';
import { BulkSaveCardComponent } from './component/cards/bulk-save-card/bulk-save-card.component';
import { LowCreditCardComponent } from './component/cards/low-credit-card/low-credit-card.component';
import { InstallProspectorComponent } from './component/cards/install-prospector/install-prospector.component';
import { InviteTeammemberComponent } from './component/cards/invite-teammember/invite-teammember.component';
import { B2bComponent } from './container/b2b/b2b.component';
import { TopTabComponent } from './component/top-tab/top-tab.component';
import { PeopleCardComponent } from './component/cards/people-card/people-card.component';
import { PeopleB2bComponent } from './container/people-b2b/people-b2b.component';
import { CompanyB2bComponent } from './container/company-b2b/company-b2b.component';
import { FilterPeopleComponent } from './component/filter-people/filter-people.component';
import { FilterCompanyComponent } from './component/filter-company/filter-company.component';
import { CompanyCardComponent } from './component/cards/company-card/company-card.component';
import { B2bListComponent } from './container/b2b-list/b2b-list.component';
import { B2bListDetailComponent } from './container/b2b-list/b2b-list-detail/b2b-list-detail.component';
import { B2bCreateListComponent } from './component/b2b-create-list/b2b-create-list.component';
import { SaveSearchListComponent } from './component/search-components/save-search-list/save-search-list.component';
import { RecentSearchPageComponent } from './container/recent-search-page/recent-search-page.component';
import { SavedSearchPageComponent } from './container/saved-search-page/saved-search-page.component';
import { RecentViewMoreComponent } from './component/search-components/recent-view-more/recent-view-more.component';
import { SavedViewMoreComponent } from './component/search-components/saved-view-more/saved-view-more.component';
import { B2bGlobalSearchComponent } from './component/b2b-global-search/b2b-global-search.component';
import { NoResultComponent } from './component/no-result/no-result.component';
import { DatevalPipe } from './pipes/datePipe';
import { MinuteDayPipe } from './pipes/minuteDayPipe';
import { ViewmoreCardComponent } from './component/cards/viewmore-card/viewmore-card.component';
import { RecentViewmoreCardComponent } from './component/cards/recent-viewmore-card/recent-viewmore-card.component';
import { SaveSearchCardComponent } from './component/cards/save-search-card/save-search-card.component';
import { RecentSearchCardComponent } from './component/cards/recent-search-card/recent-search-card.component';
import { LandingDashboardComponent } from './container/landing-dashboard/landing-dashboard.component';
import { CommonCardComponent } from './component/dashboardComponents/common-card/common-card.component';
import { DepartmentCardComponent } from './component/dashboardComponents/department-card/department-card.component';
import { IndustryCardComponent } from './component/dashboardComponents/industry-card/industry-card.component';
import { SeniorityCardComponent } from './component/dashboardComponents/seniority-card/seniority-card.component';
import { ContactsCompanyTabComponent } from './component/dashboardComponents/contacts-company-tab/contacts-company-tab.component';
import { RevenueCardComponent } from './component/dashboardComponents/revenue-card/revenue-card.component';
import { EmployeeListCardComponent } from './component/dashboardComponents/employee-list-card/employee-list-card.component';
import { ApacLocationCardComponent } from './component/dashboardComponents/apac-location-card/apac-location-card.component';
import { SaveCompanyModalComponent } from './component/save-company-modal/save-company-modal.component';
import { ShareButtonComponent } from './component/dashboardComponents/share-button/share-button.component';
import { SearchQuotaComponent } from './component/search-quota/search-quota.component';
import { ActivityCardComponent } from './component/cards/activity-card/activity-card.component';
import { CardDividerComponent } from './component/cards/card-divider/card-divider.component';
import { AddPhoneComponent } from './component/cards/add-phone/add-phone.component';
import { BasicModule } from '../basic/basic.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { OnboardingComponent } from './container/onboarding/onboarding.component';
import { B2bGuard } from './services/b2b-guard.guard';
import { ApacCompaniesComponent } from './container/apac-companies/apac-companies.component';
import { DataService } from './services/data.service';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ButtoncellrendererComponent } from '../basic/component/ag-grid/buttoncellrenderer/buttoncellrenderer.component';
import { TrimUnwantedStringPipe } from "./pipes/trim-unwanted-string.pipe";
import { ClearFilterComponent } from './component/clear-filter/clear-filter.component';
import { NoFilterComponent } from './component/no-filter/no-filter.component';
import { CompanyPanelLoaderComponent } from './component/company-panel-loader/company-panel-loader.component';
const appRoutes = [
  {
    path: "onboard",
    component: OnboardingComponent,
    canActivate: [B2bGuard],
  },
  {
    path: "apac_search",
    component: ApacCompaniesComponent,
  },
  {
    path: "b2b",
    component: B2bComponent,
    canActivate: [B2bGuard],
  },
  {
    path: "b2b-list",
    component: B2bListComponent,
  },
  {
    path: "b2b-list/:listId/:listName",
    component: B2bListDetailComponent,
  },
];

@NgModule({
  declarations: [
    B2bComponent,
    TopTabComponent,
    PeopleCardComponent,
    PeopleB2bComponent,
    CompanyB2bComponent,
    FilterPeopleComponent,
    CompanyCardComponent,
    // SaveButtonComponent,

    B2bListComponent,
    B2bListDetailComponent,
    B2bCreateListComponent,
    SaveSearchListComponent,
    RecentSearchPageComponent,
    SavedSearchPageComponent,
    RecentViewMoreComponent,
    SavedViewMoreComponent,
    B2bGlobalSearchComponent,
    NoResultComponent,
    DatevalPipe,
    MinuteDayPipe,
    ViewmoreCardComponent,

    RecentViewmoreCardComponent,
    SaveSearchCardComponent,
    RecentSearchCardComponent,
    LandingDashboardComponent,
    CommonCardComponent,
    DepartmentCardComponent,
    IndustryCardComponent,
    SeniorityCardComponent,
    ContactsCompanyTabComponent,
    RevenueCardComponent,
    EmployeeListCardComponent,
    ApacLocationCardComponent,
    SaveCompanyModalComponent,
    ShareButtonComponent,
    SearchQuotaComponent,
    ActivityCardComponent,
    CardDividerComponent,
    AddPhoneComponent,
    InviteTeammemberComponent,
    InstallProspectorComponent,
    LowCreditCardComponent,
    BulkSaveCardComponent,
    RecentNoDataComponent,
    SavedNoDataComponent,
    OnboardingComponent,
    ApacCompaniesComponent,
    FilterCompanyComponent,
    TrimUnwantedStringPipe,
    ClearFilterComponent,
    NoFilterComponent,
    CompanyPanelLoaderComponent,
  ],
  imports: [
    CommonComponentsModule,
    BasicModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule,
    // AgGridModule.withComponents([ButtoncellrendererComponent]),
    RouterModule.forChild(appRoutes),
  ],
  exports: [
    B2bComponent,
    TopTabComponent,
    PeopleCardComponent,
    PeopleB2bComponent,
    CompanyB2bComponent,
    FilterPeopleComponent,
    CompanyCardComponent,
    B2bListComponent,
    B2bListDetailComponent,
    B2bCreateListComponent,
    SaveSearchListComponent,
    RecentSearchPageComponent,
    SavedSearchPageComponent,
    RecentViewMoreComponent,
    SavedViewMoreComponent,
    B2bGlobalSearchComponent,
    NoResultComponent,
    DatevalPipe,
    MinuteDayPipe,
    ViewmoreCardComponent,
    RecentViewmoreCardComponent,
    SaveSearchCardComponent,
    RecentSearchCardComponent,
    LandingDashboardComponent,
    CommonCardComponent,
    DepartmentCardComponent,
    IndustryCardComponent,
    SeniorityCardComponent,
    ContactsCompanyTabComponent,
    RevenueCardComponent,
    EmployeeListCardComponent,
    ApacLocationCardComponent,
    SaveCompanyModalComponent,
    ShareButtonComponent,
    SearchQuotaComponent,
    ActivityCardComponent,
    CardDividerComponent,
    AddPhoneComponent,
    InviteTeammemberComponent,
    InstallProspectorComponent,
    LowCreditCardComponent,
    BulkSaveCardComponent,
    RecentNoDataComponent,
    SavedNoDataComponent,
    OnboardingComponent,
    FilterCompanyComponent,
    TrimUnwantedStringPipe,
  ],
  providers: [DataService],
})
export class B2bModule {}
