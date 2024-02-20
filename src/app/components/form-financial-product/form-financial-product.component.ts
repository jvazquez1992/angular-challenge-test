import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FinancialProduct } from '../../model/financial-product';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../shared/base-component';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription, takeUntil } from 'rxjs';
import { FinancialProductsService } from '../../services/financial-products.service';

@Component({
  selector: 'app-form-financial-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-financial-product.component.html',
  styleUrl: './form-financial-product.component.css'
})
export class FormFinancialProductComponent extends BaseComponent implements OnInit, OnDestroy {

  formulario: FormGroup = this.formBuilder.group({});
  isEdition: boolean = false;
  @Input() financialProduct: FinancialProduct = new FinancialProduct();

  message: string | null = null;
  messageType: 'info' | 'error' = 'info';
  showCard: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private financialProductService: FinancialProductsService
  ) {
    super();
  }

  initForm() {
    if (!this.isEdition) {
      this.formulario.reset();
    } else {
      this.formulario = this.formBuilder.group({
        id: new FormControl({value: this.financialProduct.id,  disabled: true}),
        name: [this.financialProduct.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: [this.financialProduct.description, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        logo: [this.financialProduct.logo, Validators.required],
        date_release: [new DatePipe('en-US').transform(this.financialProduct.date_release, 'yyyy-MM-dd'), [Validators.required, this.dateReleaseValidator]],
        date_revision: [new DatePipe('en-US').transform(this.financialProduct.date_revision, 'yyyy-MM-dd'), [Validators.required, this.dateRevisionValidator]],
      });
    }
  }

  campoEsValido(nombreCampo: string): boolean {
    var campo = this.formulario.get(nombreCampo);
    if (campo === null) {
      return false;
    } else {
      return campo.valid || !campo.touched;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnInit(): void {
    if (this.financialProduct != null && this.financialProduct.id != null) {
      this.isEdition = true;
      this.formulario = this.formBuilder.group({
        id: new FormControl({value: this.financialProduct.id,  disabled: true}),
        name: [this.financialProduct.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: [this.financialProduct.description, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        logo: [this.financialProduct.logo, Validators.required],
        date_release: [new DatePipe('en-US').transform(this.financialProduct.date_release, 'yyyy-MM-dd'), [Validators.required, this.dateReleaseValidator]],
        date_revision: [new DatePipe('en-US').transform(this.financialProduct.date_revision, 'yyyy-MM-dd'), [Validators.required, this.dateRevisionValidator]],
      });
    } else {
      this.isEdition = false;
      this.formulario = this.formBuilder.group({
        id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        logo: ['', Validators.required],
        date_release: ['', [Validators.required, this.dateReleaseValidator]],
        date_revision: ['', [Validators.required, this.dateRevisionValidator]],
      });
    }
  }


  save() {
    console.log('FORM HERE '+JSON.stringify(this.formulario.value));
    console.log('FORM STATUS HERE '+this.formulario.valid);
    if(this.formulario.valid){
      let objectToSend = this.formulario.value as FinancialProduct;
      console.log('OBJECT HERE '+JSON.stringify(objectToSend));
      if (this.isEdition) {
        this.financialProductService.putFinancialProducts(objectToSend)
          .pipe(takeUntil(this.unsusbscribe$))
          .subscribe({
            next: response => {
              this.showMessage('Actualización exitosa', 'info');
              this.financialProduct = new FinancialProduct();
              this.initForm();
            },
            error: err => {
              this.showMessage(err, 'error');
              console.error(err);
            },
            complete: () => {
              console.log('Complete');
            }
          });
      } else {

        this.financialProductService.verifyFinancialProducts(objectToSend.id)
        .pipe(takeUntil(this.unsusbscribe$))
        .subscribe({
          next: response => {
            if(response === false){
              this.financialProductService.postFinancialProducts(objectToSend)
              .pipe(takeUntil(this.unsusbscribe$))
              .subscribe({
                next: response => {
                  this.showMessage('Registro exitoso', 'info');
                  this.financialProduct = new FinancialProduct();
                  this.initForm();
                },
                error: err => {
                  this.showMessage(err, 'error');
                },
                complete: () => {
                  console.log('Complete');
                }
              });
            }else{
              this.showMessage('Producto existente', 'error');
            }
          }
        });
      }
    }else{
      this.formulario.markAllAsTouched();
    }
  }

  dateReleaseValidator(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate >= currentDate ? null : { invalidDate: true };
  }

  dateRevisionValidator(control: any) {
    const selectedDate = new Date(control.value);
    if (control.parent == null || control.parent.get('date_release') == null) {
      return true;
    }
    const releaseDate = new Date(control.parent.get('date_release').value);
    const oneYearAfterRelease = new Date(releaseDate);
    oneYearAfterRelease.setFullYear(oneYearAfterRelease.getFullYear() + 1);
    return selectedDate >= oneYearAfterRelease ? null : { invalidDate: true };
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
