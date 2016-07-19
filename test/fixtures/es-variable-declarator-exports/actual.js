import _, { camelCase } from 'lodash-es';
import { snakeCase } from 'string';

export const case1 = camelCase;
export const case2 = _.kebabCase;
export const case3 = snakeCase;
