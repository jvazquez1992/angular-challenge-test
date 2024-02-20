import * as matchers from 'jest-extended';
expect.extend(matchers);

import { toBeArray, toBeSealed } from 'jest-extended';
expect.extend({ toBeArray, toBeSealed });

import { expect } from 'vitest';
import * as matchers from 'jest-extended';
expect.extend(matchers);