import { capitalize, isNumber, isString, round } from 'lodash';
import fp, { partial } from 'lodash/fp';

cond([
  [isNumber, round],
  [isString, capitalize]
])(1.8);

partial(function(a, b) { return [a, b]; })([fp, 2]);
