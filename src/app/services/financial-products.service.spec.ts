import { TestBed } from '@angular/core/testing';

import { FinancialProductsService } from './financial-products.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancialProduct } from '../model/financial-product';
import { enviroment } from '../../enviroments/enviroment';

const financialProduct: FinancialProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'test.png',
  date_release: new Date(),
  date_revision: new Date()
};

describe('FinancialProductsService', () => {

  let http: HttpTestingController;
  let service: FinancialProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductsService]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FinancialProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    service.getFinancialProducts().subscribe((res) => {
      expect(res).toEqual([financialProduct]);
    });
  });

  it('should post registro', () => {
    service.postFinancialProducts(financialProduct).toPromise().then(res => {
      expect(res).toEqual(financialProduct);
    })
    const req = http.expectOne(enviroment.URL_FINANCIAL_PRODUCTS+'bp/products');
    expect(req.request.method).toEqual('POST');
    req.flush(financialProduct);
  });

  it('should put registro', () => {
    service.putFinancialProducts(financialProduct).toPromise().then(res => {
      expect(res).toEqual(financialProduct);
    })
    const req = http.expectOne(enviroment.URL_FINANCIAL_PRODUCTS+'bp/products');
    expect(req.request.method).toEqual('PUT');
    req.flush(financialProduct);
  });

  it('should delete registro', () => {
    service.deleteFinancialProducts(financialProduct.id).toPromise().then(res => {
      expect(res).toEqual('OK');
    })
    const req = http.expectOne(enviroment.URL_FINANCIAL_PRODUCTS+'bp/products?id='+financialProduct.id);
    expect(req.request.method).toEqual('DELETE');
    req.flush('OK');
  });

  it('should delete registro', () => {
    service.deleteFinancialProducts(financialProduct.id).toPromise().then(res => {
      expect(res).toEqual('OK');
    })
    const req = http.expectOne(enviroment.URL_FINANCIAL_PRODUCTS+'bp/products?id='+financialProduct.id);
    expect(req.request.method).toEqual('DELETE');
    req.flush('OK');
  });

});
