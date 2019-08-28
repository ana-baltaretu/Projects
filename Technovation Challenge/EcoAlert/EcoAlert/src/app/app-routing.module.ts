import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'tab1', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'register1', loadChildren: './register1/register1.module#Register1PageModule' },
  { path: 'event-details/:eventId', loadChildren: './event-details/event-details.module#EventDetailsPageModule' },
  { path: 'map-events', loadChildren: './map-events/map-events.module#MapEventsPageModule' },
  { path: 'map-choose-location', loadChildren: './map-choose-location/map-choose-location.module#MapChooseLocationPageModule' },  { path: 'create-event', loadChildren: './create-event/create-event.module#CreateEventPageModule' },
  { path: 'notifications-range', loadChildren: './notifications-range/notifications-range.module#NotificationsRangePageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
