 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationComponent } from './general/cancellation/cancellation.component';
import { FooterComponent } from './general/footer/footer.component';
import { HeaderComponent } from './general/header/header.component';
 
import { PolicyComponent } from './general/policy/policy.component';
 
import { TermUseComponent } from './general/term-use/term-use.component';




const routes: Routes = [
    { path: 'cancellation', component: CancellationComponent },
     
    { path: 'footer', component: FooterComponent },
    { path: 'header', component: HeaderComponent },
    { path: 'policy', component: PolicyComponent },
    { path: 'termUse', component: TermUseComponent },
 
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CoreRoutingModule { }