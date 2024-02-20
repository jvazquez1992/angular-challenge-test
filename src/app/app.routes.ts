import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FormFinancialProductComponent } from './components/form-financial-product/form-financial-product.component';

export const routes: Routes = [
    {path: 'main-page', component: MainPageComponent},
    {path: 'product-crud', component:FormFinancialProductComponent}
];
