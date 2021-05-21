import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { RelevancePlanUploadListComponent } from './relevance-plan/upload-list/upload-list.component';
import { RelevancePlanRelevanceListComponent } from './relevance-plan/relevance-list/relevance-list.component';
import { OperationProcessWarningInformationListComponent } from './operation-process/warning-information-list/warning-information-list.component';
import { OperationProcessLocaleControlListComponent } from './operation-process/locale-control-list/locale-control-list.component';
import { OperationProcessDatePlanListComponent } from './operation-process/date-plan-list/date-plan-list.component';
import { HelpProjectSignificanceComponent } from './help/project-significance/project-significance.component';
import { HelpAboutUsComponent } from './help/about-us/about-us.component';
import { CenterScreenScreenComponent } from './center-screen/screen/screen.component';
import { ConstructionControlPlanListComponent } from './construction-control-plan/list/list.component';
import { CenterScreenSetScreenComponent } from './center-screen/set-screen/set-screen.component';
import { TestTestWebsocketComponent } from './test/test-websocket/test-websocket.component';
import { CenterScreenSetPositionComponent } from './center-screen/set-position/set-position.component';
import { StatisticAnalysisMainComponent } from './statistic-analysis/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard/v1', component: DashboardV1Component },
      { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
      { path: 'dashboard/monitor', component: DashboardMonitorComponent },
      { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
      {
        path: 'widgets',
        loadChildren: () => import('./widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      { path: 'style', loadChildren: () => import('./style/style.module').then((m) => m.StyleModule) },
      { path: 'role', loadChildren: () => import('./role/role.module').then((m) => m.RoleModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then((m) => m.UserModule) },
      { path: 'station', loadChildren: () => import('./station/station.module').then((m) => m.StationModule) },
      { path: 'railway-line', loadChildren: () => import('./railway-line/railway-line.module').then((m) => m.RailwayLineModule) },
      { path: 'organization', loadChildren: () => import('./organization/organization.module').then((m) => m.OrganizationModule) },
      { path: 'device', loadChildren: () => import('./device/device.module').then((m) => m.DeviceModule) },
      { path: 'device-type', loadChildren: () => import('./device-type/device-type.module').then((m) => m.DeviceTypeModule) },
      {
        path: 'device-sub-type',
        loadChildren: () => import('./device-sub-type/device-sub-type.module').then((m) => m.DeviceSubTypeModule),
      },
      {
        path: 'measurement-template',
        loadChildren: () => import('./measurement-template/measurement-template.module').then((m) => m.MeasurementTemplateModule),
      },
      { path: 'map', loadChildren: () => import('./map/map.module').then((m) => m.MapModule) },
      {
        path: 'measurement-task',
        loadChildren: () => import('./measurement-task/measurement-task.module').then((m) => m.MeasurementTaskModule),
      },
      {
        path: 'role-organization',
        loadChildren: () => import('./role-organization/role-organization.module').then((m) => m.RoleOrganizationModule),
      },
      {
        path: 'construction-control-plan',
        loadChildren: () =>
          import('./construction-control-plan/construction-control-plan.module').then((m) => m.ConstructionControlPlanModule),
      },
      {
        path: 'test',
        loadChildren: () => import('./test/test.module').then((m) => m.TestModule),
      },
      { path: 'test/test-websoket', component: TestTestWebsocketComponent },

      {
        path: 'statistic-analysis',
        loadChildren: () => import('./statistic-analysis/statistic-analysis.module').then((m) => m.StatisticAnalysisModule),
      },
      { path: 'statistic-analysis/main', component: StatisticAnalysisMainComponent },

      { path: 'construction-control-plan/list/:id', component: ConstructionControlPlanListComponent },
      {
        path: 'construction-formal-plan',
        loadChildren: () =>
          import('./construction-formal-plan/construction-formal-plan.module').then((m) => m.ConstructionFormalPlanModule),
      },
      { path: 'opc', loadChildren: () => import('./opc/opc.module').then((m) => m.OpcModule) },
      { path: 'opc-type', loadChildren: () => import('./opc-type/opc-type.module').then((m) => m.OpcTypeModule) },
      { path: 'equipment', loadChildren: () => import('./equipment/equipment.module').then((m) => m.EquipmentModule) },
      { path: 'opc-mark-type', loadChildren: () => import('./opc-mark-type/opc-mark-type.module').then((m) => m.OpcMarkTypeModule) },
      {
        path: 'line-location-data',
        loadChildren: () => import('./line-location-data/line-location-data.module').then((m) => m.LineLocationDataModule),
      },
      { path: 'delon', loadChildren: () => import('./delon/delon.module').then((m) => m.DelonModule) },
      { path: 'extras', loadChildren: () => import('./extras/extras.module').then((m) => m.ExtrasModule) },
      { path: 'pro', loadChildren: () => import('./pro/pro.module').then((m) => m.ProModule) },

      {
        path: 'construction-coordinate-plan',
        loadChildren: () =>
          import('./construction-coordinate-plan/construction-coordinate-plan.module').then((m) => m.ConstructionCoordinatePlanModule),
      },
      {
        path: 'relevance-plan',
        loadChildren: () => import('./relevance-plan/relevance-plan.module').then((m) => m.RelevancePlanModule),
      },
      { path: 'relevance-plan/upload-list', component: RelevancePlanUploadListComponent },
      { path: 'relevance-plan/relevance-list', component: RelevancePlanRelevanceListComponent },

      {
        path: 'operation-process',
        loadChildren: () => import('./operation-process/operation-process.module').then((m) => m.OperationProcessModule),
      },
      { path: 'operation-process/date-plan-list', component: OperationProcessDatePlanListComponent },
      { path: 'operation-process/locale-control-list', component: OperationProcessLocaleControlListComponent },
      { path: 'operation-process/warning-information-list', component: OperationProcessWarningInformationListComponent },

      { path: 'center-screen', loadChildren: () => import('./center-screen/center-screen.module').then((m) => m.CenterScreenModule) },
      { path: 'center-screen/set-screen', component: CenterScreenSetScreenComponent },
      { path: 'center-screen/set-position', component: CenterScreenSetPositionComponent },

      {
        path: 'railway-line-section',
        loadChildren: () => import('./railway-line-section/railway-line-section.module').then((m) => m.RailwayLineSectionModule),
      },

      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
      },
      { path: 'help/project-significance', component: HelpProjectSignificanceComponent },
      { path: 'help/about-us', component: HelpAboutUsComponent },

      // Exception
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule) },
    ],
  },
  // 全屏布局
  {
    path: 'data-v',
    component: LayoutFullScreenComponent,
    children: [{ path: '', loadChildren: () => import('./data-v/data-v.module').then((m) => m.DataVModule) }],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录' },
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册' },
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果' },
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏' },
      },
    ],
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
