import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { PopupComponent } from './components/popup/popup.component';
import { SuccessComponent } from './components/success/success.component';
import { ErrorComponent } from './components/error/error.component';
import { HeroComponent } from './components/hero/hero.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DontBeShyComponent } from './components/dont-be-shy/dont-be-shy.component';
import { HeroSimpleComponent } from './components/hero/hero-simple/hero-simple.component';
import { HeroSimpleImageComponent } from './components/hero/hero-simple-image/hero-simple-image.component';
import { SharedPopupComponent } from './components/shared-popup/shared-popup.component';
import { AuthRoutingModule } from './shared-routing.module';
import { TawkComponent } from './components/chat-box/tawk/tawk.component';



@NgModule({
  declarations: [
    LoaderComponent,
    ThankYouComponent,
    PopupComponent,
    SuccessComponent,
    ErrorComponent,
    HeroComponent,
    NotFoundComponent,
    HeroSimpleImageComponent,
    HeroSimpleComponent,
    HomeComponent,
    DontBeShyComponent,
    HeroSimpleComponent,
    HeroSimpleImageComponent,
    SharedPopupComponent,
    TawkComponent
  ],
  imports: [
    CommonModule,
    CarouselModule, AuthRoutingModule
  ],
  exports: [HeroComponent,HeroSimpleComponent,HeroSimpleImageComponent,TawkComponent]
})
export class SharedModule { }
