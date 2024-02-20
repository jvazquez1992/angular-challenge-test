import type CustomMatchers from 'jest-extended';
import 'vi';

interface MyCustomMatchers {
  toBeFoo(): any;
}

declare module 'vi' {
  interface Assertion<T = any> extends CustomMatchers<T>, MyCustomMatchers {}
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T>, MyCustomMatchers {}
  interface ExpectStatic extends CustomMatchers, MyCustomMatchers {}
}