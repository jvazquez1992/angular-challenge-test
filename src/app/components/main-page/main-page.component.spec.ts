import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FinancialProductsService } from '../../services/financial-products.service';
import { FinancialProduct } from '../../model/financial-product';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const financialProduct: FinancialProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'test.png',
  date_release: new Date('2023-01-01'),
  date_revision: new Date('2024-01-01')
};

describe('MainPageComponent', () => {

  let mockAPIService: Partial<FinancialProductsService>;

  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    mockAPIService = {
      getFinancialProducts: jest.fn().mockReturnValue(of([])),
      deleteFinancialProducts: jest.fn()
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
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init component', async () => {
    jest.spyOn(mockAPIService, 'getFinancialProducts').mockReturnValue(of([financialProduct]));
    component.ngOnInit();
    expect(mockAPIService!.getFinancialProducts).toHaveBeenCalled();
    expect(component.financialProducts.length).toBe(1);
  });

  it('should show list', async () => {
    component.mostrarListado = false;
    component.selectedFinancialProduct = financialProduct;
    component.changeView();
    expect(mockAPIService.getFinancialProducts).toHaveBeenCalled();
    expect(component.selectedFinancialProduct).not.toBe(null);
  });

  it('should show edit product view', async () => {
    component.selectedFinancialProduct = new FinancialProduct();
    component.mostrarListado = true;
    component.editProduct(financialProduct);
    expect(component.selectedFinancialProduct).toBe(financialProduct);
    expect(component.mostrarListado).toBe(false);
  });

  it('should delete item', async()=> {
    component.financialProducts = [financialProduct];
    jest.spyOn(mockAPIService, 'deleteFinancialProducts').mockReturnValue(of('OK'));
    component.deleteItem(financialProduct);
    expect(mockAPIService.deleteFinancialProducts).toHaveBeenCalled();
    expect(mockAPIService.getFinancialProducts).toHaveBeenCalled();
  });

});
