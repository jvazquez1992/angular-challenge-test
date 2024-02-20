import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFinancialProductComponent } from './form-financial-product.component';
import { FinancialProduct } from '../../model/financial-product';
import { FinancialProductsService } from '../../services/financial-products.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

let actualDate = new Date();
actualDate.setDate(actualDate.getDate()+1);
let oneYearLater = new Date();
oneYearLater.setDate(oneYearLater.getDate()+1);
oneYearLater.setFullYear(oneYearLater.getFullYear()+1);

const financialProduct: FinancialProduct = {
  id: '111',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'test.png',
  date_release: actualDate,
  date_revision: oneYearLater
};

describe('FormFinancialProductComponent', () => {

  let mockAPIService: Partial<FinancialProductsService>;

  let component: FormFinancialProductComponent;
  let fixture: ComponentFixture<FormFinancialProductComponent>;

  beforeEach(async () => {
    mockAPIService = {
      putFinancialProducts: jest.fn().mockReturnValue(of({})),
      postFinancialProducts: jest.fn().mockReturnValue(of({})),
      verifyFinancialProducts: jest.fn().mockReturnValue(of({}))
    }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: FinancialProductsService, useValue: mockAPIService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFinancialProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be create mode', () => {
    component.financialProduct = new FinancialProduct();
    component.ngOnInit();
    expect(component.isEdition).toBe(false);
  });

  it('should be edition mode', () => {
    component.financialProduct = financialProduct;
    component.ngOnInit();
    expect(component.isEdition).toBe(true);
    expect(component.formulario.get('id')!.value).toBe(financialProduct.id);    
  });

  it('should update valid form', async () => {
    component.formulario.patchValue(financialProduct);
    component.isEdition = true;
    jest.spyOn(mockAPIService, 'putFinancialProducts').mockReturnValue(of(financialProduct));
    component.save();
    expect(mockAPIService!.putFinancialProducts).toHaveBeenCalled();
    expect(component.financialProduct).toBeDefined();
  });

  it('should not save when form is invalid', async () => {
    const spyMarkAllAsTouched = jest.spyOn(component.formulario, 'markAllAsTouched');
    component.formulario.patchValue({
      id: '1',
      name: null,
      description: 'Test Description',
      logo: 'test.png',
      date_release: new Date(),
      date_revision: null
    });
    component.save();
    expect(spyMarkAllAsTouched).toHaveBeenCalled();
  });

  it('should create valid form', async () => {
    component.formulario.patchValue(financialProduct);
    jest.spyOn(mockAPIService, 'verifyFinancialProducts').mockReturnValue(of(false));
    jest.spyOn(mockAPIService, 'postFinancialProducts').mockReturnValue(of(financialProduct));
    component.isEdition = false;
    component.save();
    expect(component.isEdition).toBe(false);
  });

  it('should date_release_validator valid date', async()=> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const result = component.dateReleaseValidator({ value: currentDate });
    expect(result).toBeNull();
  });

  it('should date_release_validator invalid date', async()=> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const result = component.dateReleaseValidator({ value: currentDate });
    expect(result).toEqual({ invalidDate: true });
  });

  it('should date_revision_validator invalid date', async()=> {
    const releaseDate = new Date('2023-01-01');
    const selectedDate = new Date(releaseDate);
    selectedDate.setDate(selectedDate.getDate() + 1);
    const control = { value: selectedDate, parent: { get: () => releaseDate } };
    const result = component.dateRevisionValidator(control);
    expect(result).toEqual({ invalidDate: true });
  });


});
 