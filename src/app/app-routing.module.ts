import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SceneComponent} from "./component/scene/scene.component";
import {SettingsComponent} from "./component/settings/settings.component";

const routes: Routes = [
  {
    path: 'view',
    component: SceneComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    component: SceneComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
