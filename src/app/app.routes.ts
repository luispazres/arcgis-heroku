// tslint:disable-next-line:eofline
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from "./components/maps/map/map.component";


const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'map', component: MapComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
