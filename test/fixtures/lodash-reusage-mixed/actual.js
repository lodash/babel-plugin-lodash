import _ from 'lodash';
import { map } from 'lodash';

const result1 = map([1, 2, 3], () => {});
const result2 = _.map([], () => {});
const result3 = map([], () => {});
const result4 = _.map([], () => {});
