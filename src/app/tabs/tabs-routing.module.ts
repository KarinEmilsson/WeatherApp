import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'avaluator',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/avaluator/avaluator.module').then(m => m.AvaluatorPageModule)
          }
        ]
      },
      {
        path: 'weather',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/weather/weather.module').then(m => m.WeatherPageModule)
          }
        ]
      },
      {
        path: 'forecast',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/forecast/forecast.module').then(m => m.ForecastPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/avaluator',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/avaluator',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
