import { capitalize, cond, isNumber, isString, round } from 'lodash';
import fp, { partial } from 'lodash/fp';

cond([
  [isNumber, round],
  [isString, capitalize]
])(1.8);

partial((a, b) => [a, b])([fp, 2]);
