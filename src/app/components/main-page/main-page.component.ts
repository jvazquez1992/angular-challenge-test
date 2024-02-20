import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinancialProductsService } from '../../services/financial-products.service';
import { FinancialProduct } from '../../model/financial-product';
import { Subscription, takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/base-component';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFinancialProductComponent } from '../form-financial-product/form-financial-product.component';
//import { FormFinancialProductComponent } from '../form-financial-product/form-financial-product.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormFinancialProductComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent extends BaseComponent implements OnInit, OnDestroy {

  selectedNumber = 5;
  numbers: number[] = [5,10,15,20];


  searchTerm: string = '';

  mostrarListado: boolean = true;
  financialProducts: FinancialProduct[] = [];
  selectedFinancialProduct: FinancialProduct = new FinancialProduct();
  displayedColumns: string[] = ['Logo', 'Nombre del producto', 'Descripción','Fecha de liberación','Fecha de reestructuración'];

  message: string | null = null;
  messageType: 'info' | 'error' = 'info';
  showCard: boolean = false;

  constructor(
    private financialProductService: FinancialProductsService
  ){
    super();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(){
    this.financialProductService.getFinancialProducts()
    .pipe(takeUntil(this.unsusbscribe$))
    .subscribe({
      next: response => {
        this.financialProducts = response;
      },
      error: err => {
        this.showMessage(err, 'error');
        console.error(err);
      },
      complete: () => {
        console.log('Complete');
      }
    });
  }

  onSearchChange(value: string) {
    console.log("Search term:", value);
  }

  changeView(){
    this.mostrarListado = !this.mostrarListado;
    if(this.mostrarListado){
      this.selectedFinancialProduct = new FinancialProduct();
      this.getProducts();
    }
  }

  editProduct(financialProduct: FinancialProduct){
    this.selectedFinancialProduct = financialProduct;
    this.changeView();
  }

  
  confirmDelete(financialProduct:FinancialProduct):void{
    if(confirm('¿Estas seguro de eliminar el producto '+financialProduct.name+'?')){
      this.deleteItem(financialProduct);
    }
  }

  deleteItem(financialProduct:FinancialProduct): void {
    this.financialProductService.deleteFinancialProducts(financialProduct.id)
    .pipe(takeUntil(this.unsusbscribe$))
    .subscribe({
      next: response => {
        this.getProducts();
        this.showMessage('Registro eliminado', 'info');
      },
      error: err => {
        this.showMessage(err, 'error');
        console.error(err);
      },
      complete: () => {
        console.log('Complete');
      }
    });
  }

  get filteredData() {
    if(this.searchTerm!=null){
      return this.financialProducts.filter(item =>
        item.logo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }else{
      return this.financialProducts;
    }
  }

  showMessage(message: string, messageType: 'info' | 'error') {
    this.message = message;
    this.messageType = messageType;
    this.showCard = true;
    setTimeout(() => {
      this.hideMessage();
    }, 5000);
  }

  hideMessage() {
    this.showCard = false;
    this.message = null;
  }

}
