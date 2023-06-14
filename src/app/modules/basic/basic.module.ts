import { NgModule } from "@angular/core";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";
import { SidemenuComponent } from "./component/sidemenu/sidemenu.component";
import { SearchComponent } from "./component/search/search.component";
import { LoaderComponent } from "./component/loader/loader.component";
import { SuccessComponent } from "./component/alerts/success/success.component";
import { ErrorComponent } from "./component/alerts/error/error.component";
import { TexthighlightPipe } from "./pipes/texthighlight.pipe";
import { UpgradeComponent } from "./component/upgrade/upgrade.component";
import { AgGridModule } from "ag-grid-angular";
import { ButtoncellrendererComponent } from "./component/ag-grid/buttoncellrenderer/buttoncellrenderer.component";
import { CreatelistComponent } from "../healthcare/containers/lists/createlist/createlist.component";
import { IndividualFilterComponent } from "./component/ampliz-filter/individual-filter/individual-filter.component";
import { IndividualLocationFilterComponent } from "./component/ampliz-filter/individual-location-filter/individual-location-filter.component";
import { AlertBoxComponent } from "../B2B/component/alert-box/alert-box.component";
import { InlineAlertComponent } from "./component/inline-alert/inline-alert.component";
import { UnlockComponent } from "./component/unlock/unlock.component";
import { CircleLoaderComponent } from "./component/circle-loader/circle-loader.component";
import { CheckboxComponent } from "./component/checkbox/checkbox.component";
import { B2bLoaderComponent } from "../B2B/component/b2b-loader/b2b-loader.component";
import { B2bSavelistComponent } from "../B2B/component/b2b-savelist/b2b-savelist.component";
import { SelectBulkModalComponent } from "../B2B/component/select-bulk-modal/select-bulk-modal.component";
import { SaveContactModalComponent } from "../B2B/component/save-contact-modal/save-contact-modal.component";
import { NotCorrectComponent } from "../B2B/component/not-correct/not-correct.component";
import { SkeletonLoaderComponent } from "./component/skeleton-loader/skeleton-loader.component";
import { NumberWithCommasPipe } from "../healthcare/pipe/number-with-commas.pipe";
import { HcTopTabComponent } from "./component/hc-top-tab/hc-top-tab.component";
import { LoginComponent } from "./container/userauth/login/login.component";
import { DashboardComponent } from "../healthcare/containers/dashboard/dashboard.component";
import { ContactsComponent } from "./container/contacts/contacts.component";
import { RequesthifiComponent } from "./container/requesthifi/requesthifi.component";
import { PaymentComponent } from "./component/payment/payment.component";
import { DashboardFilterComponent } from "../healthcare/component/filters/dashboard_filter/dashboardfilter.component";
import { ShortNamePipe } from "../healthcare/component/filters/dashboard_filter/short-name.pipe";
import { PricingComponent } from "./component/pricing/pricing.component";
import { EditprofileComponent } from "./container/editprofile/editprofile.component";
import { FreecreditsComponent } from "./container/freecredits/freecredits.component";
import { PaymentHistoryComponent } from "./component/payment_history/payment_history.component";
import { CommonComponentsModule } from "../common-components/common-components.module";
import { DataTableComponent } from "./component/data-table/data-table.component";
import { SignupComponent } from "src/app/modules/basic/container/userauth/signup/signup.component";
import { HcInputComponent } from "./component/hc-input/hc-input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HcDropdownComponent } from "./component/hc-dropdown/hc-dropdown.component";
import { HcCountryselectComponent } from './component/hc-countryselect/hc-countryselect.component';
import { AmplizMenuButtonComponent } from './component/buttons/ampliz-menu-button/ampliz-menu-button.component';
// import { InviteTeammemberComponent } from "./container/invite-teammember/invite-teammember.component";
// import { AddUserCardComponent } from "./component/invite-teammember/add-user-card/add-user-card.component";
// import { PendingInvitesCardComponent } from "./component/invite-teammember/pending-invites-card/pending-invites-card.component";
// import { RemoveTeammateDrawerComponent } from "./component/invite-teammember/remove-teammate-drawer/remove-teammate-drawer.component";
// import { AddRemoveCreditDrawerComponent } from "./component/invite-teammember/add-remove-credit-drawer/add-remove-credit-drawer.component";
// import { InviteTeammateDrawerComponent } from "./component/invite-teammember/invite-teammate-drawer/invite-teammate-drawer.component";
import { StartcasePipe } from './pipes/startcase.pipe';
import { FirstletterPipe } from './pipes/firstletter.pipe';
import { VerifyUserComponent } from './container/userauth/verify-user/verify-user.component';
import { OtpInputComponent } from './component/otp-input/otp-input.component';
import { IconsModule } from './icons/icons.module';
import { ExportButtonLoaderComponent } from './component/export-button-loader/export-button-loader.component';
import { RequestContactComponent } from './component/request-contact/request-contact.component';
import { DeleteIconAgGridComponent } from './component/delete-icon-ag-grid/delete-icon-ag-grid.component';
import { ExportCsvBtnComponent } from './component/export-csv-btn/export-csv-btn.component';
import { DailySearchQuotaComponent } from './component/daily-search-quota/daily-search-quota.component';
import { CustomTooltipComponent } from './component/custom-tooltip/custom-tooltip.component';
import { ContactInfoTooltipComponent } from './component/contact-info-tooltip/contact-info-tooltip.component';
import { ListActionButtonComponent } from './component/list-action-button/list-action-button.component';
import { QuotaCardComponent } from './component/b2b-dashboard/quota-card/quota-card.component';
import { CardSkeletonLoaderComponent } from './component/b2b-dashboard/card-skeleton-loader/card-skeleton-loader.component';
import { LowCreditAlertCardComponent } from './component/b2b-dashboard/low-credit-alert-card/low-credit-alert-card.component';
import { DashboardChromeCardComponent } from './component/b2b-dashboard/dashboard-chrome-card/dashboard-chrome-card.component';
import { FeedbackCardComponent } from './component/b2b-dashboard/feedback-card/feedback-card.component';
import { RecommendCardComponent } from './component/b2b-dashboard/recommend-card/recommend-card.component';
import { HistorySearchCardComponent } from './component/b2b-dashboard/history-search-card/history-search-card.component';
import { TeamMemberComponent } from './container/team-member/team-member.component';
import { MemberCardComponent } from './component/team-member/member-card/member-card.component';
import { MemberSidePanelComponent } from './component/team-member/member-side-panel/member-side-panel.component';
import { MemberActionPanelComponent } from './component/team-member/member-action-panel/member-action-panel.component';
const appRoutes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'verify',
    component: VerifyUserComponent,
  },
  // {
  //   path: "signup/:type/:inviteId",
  //   component: SignupComponent
  // },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
  {
    path: 'requesthifi/:name',
    component: RequesthifiComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'idealprofile',
    component: DashboardFilterComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: 'editprofile',
    component: EditprofileComponent,
  },
  {
    path: 'freecredits',
    component: FreecreditsComponent,
  },
  {
    path: 'payment_history',
    component: PaymentHistoryComponent,
  },
  {
    path: 'team-member',
    component: TeamMemberComponent,
  },
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    SearchComponent,
    LoaderComponent,
    SuccessComponent,
    ErrorComponent,
    TexthighlightPipe,
    UpgradeComponent,
    CreatelistComponent,
    IndividualFilterComponent,
    IndividualLocationFilterComponent,
    AlertBoxComponent,
    InlineAlertComponent,
    UnlockComponent,
    CircleLoaderComponent,
    CheckboxComponent,
    B2bLoaderComponent,
    B2bSavelistComponent,
    SelectBulkModalComponent,
    SaveContactModalComponent,
    NotCorrectComponent,
    ButtoncellrendererComponent,
    SkeletonLoaderComponent,
    NumberWithCommasPipe,
    HcTopTabComponent,
    LoginComponent,
    DashboardComponent,
    ContactsComponent,
    RequesthifiComponent,
    PaymentComponent,
    DashboardFilterComponent,
    ShortNamePipe,
    PricingComponent,
    EditprofileComponent,
    FreecreditsComponent,
    PaymentHistoryComponent,
    DataTableComponent,
    SignupComponent,
    HcInputComponent,
    HcDropdownComponent,
    HcCountryselectComponent,
    AmplizMenuButtonComponent,
    // InviteTeammemberComponent,
    // AddUserCardComponent,
    // PendingInvitesCardComponent,
    // RemoveTeammateDrawerComponent,
    // AddRemoveCreditDrawerComponent,
    // InviteTeammateDrawerComponent,
    StartcasePipe,
    FirstletterPipe,
    VerifyUserComponent,
    OtpInputComponent,
    ExportButtonLoaderComponent,
    RequestContactComponent,
    DeleteIconAgGridComponent,
    ExportCsvBtnComponent,
    DailySearchQuotaComponent,
    CustomTooltipComponent,
    ContactInfoTooltipComponent,
    ListActionButtonComponent,
    QuotaCardComponent,
    CardSkeletonLoaderComponent,
    LowCreditAlertCardComponent,
    DashboardChromeCardComponent,
    FeedbackCardComponent,
    RecommendCardComponent,
    HistorySearchCardComponent,
    TeamMemberComponent,
    MemberCardComponent,
    MemberSidePanelComponent,
    MemberActionPanelComponent,
  ],
  imports: [
    CommonComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule,
    RouterModule.forChild(appRoutes),
    ReactiveFormsModule,
    IconsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    SearchComponent,
    LoaderComponent,
    SuccessComponent,
    ErrorComponent,
    TexthighlightPipe,
    UpgradeComponent,
    CreatelistComponent,
    IndividualFilterComponent,
    IndividualLocationFilterComponent,
    AlertBoxComponent,
    InlineAlertComponent,
    UnlockComponent,
    CircleLoaderComponent,
    CheckboxComponent,
    B2bLoaderComponent,
    B2bSavelistComponent,
    SelectBulkModalComponent,
    SaveContactModalComponent,
    NotCorrectComponent,
    ButtoncellrendererComponent,
    SkeletonLoaderComponent,
    NumberWithCommasPipe,
    HcTopTabComponent,
    ShortNamePipe,
    PricingComponent,
    EditprofileComponent,
    DataTableComponent,
    StartcasePipe,
    IconsModule,
    // InviteTeammemberComponent,
    RequestContactComponent,
    ExportButtonLoaderComponent,
    DeleteIconAgGridComponent,
  ],
})
export class BasicModule {}
