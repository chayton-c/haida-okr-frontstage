import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FlowIndexOne } from './components/flow-index-one/flow-index-one';
import { FlowPathIndex } from './components/flow-path-index/flow-path-index';
import { BackIndex } from './components/back-index/back-index';

import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UEditorModule } from 'ngx-ueditor';
import { FlowIndexTwo } from './components/flow-index-two/flow-index-two';
import { TopNavigation } from './components/top-navigation/top-navigation';
import { StationMap } from './components/station-map/station-map';
import { UploadImageList } from './components/upload-image-list/upload-image-list';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
// import {ConstructionControlPlanView} from "./components/construction-control-plan/view/construction-control-plan-view";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ConstructionCoordinatePlanModule } from '../routes/construction-coordinate-plan/construction-coordinate-plan.module';

const THIRDMODULES = [CountdownModule, UEditorModule, NgxTinymceModule];
// #endregion

// #region your componets & directives
const COMPONENTS: Type<any>[] = [];
const DIRECTIVES: Type<any>[] = [];
// #endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonACLModule,
        DelonFormModule,
        ...SHARED_DELON_MODULES,
        ...SHARED_ZORRO_MODULES,
        // third libs
        ...THIRDMODULES,
        NzTreeSelectModule,
        NzDescriptionsModule,
    ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    FlowPathIndex,
    FlowIndexOne,
    FlowIndexTwo,
    TopNavigation,
    BackIndex,
    StationMap,
    UploadImageList,
    // ConstructionControlPlanView,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    TranslateModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    FlowPathIndex,
    BackIndex,
    FlowIndexOne,
    FlowIndexTwo,
    TopNavigation,
    StationMap,
    UploadImageList,
    // ConstructionControlPlanView,
  ],
})
export class SharedModule {}
