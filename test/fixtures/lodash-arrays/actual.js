import { cond, isNumber, isString, round, toUpper } from 'lodash';
import fp, { partial } from 'lodash/fp';

cond([
  [isNumber, round],
  [isString, toUpper]
])(1.8);

partial(func)([fp, 2])(1);
