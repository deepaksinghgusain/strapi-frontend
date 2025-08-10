import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DontBeShyComponent } from './components/dont-be-shy/dont-be-shy.component';
import { ErrorComponent } from './components/error/error.component';
import { HeroComponent } from './components/hero/hero.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PopupComponent } from './components/popup/popup.component';
import { SuccessComponent } from './components/success/success.component';




const routes: Routes = [
    { path: 'loader', component: LoaderComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'hero', component: HeroComponent },
    { path: 'notFound', component: NotFoundComponent },
    { path: 'popup', component: PopupComponent },
    { path: 'notFound', component: NotFoundComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'dont-be-shy', component: DontBeShyComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthRoutingModule { }