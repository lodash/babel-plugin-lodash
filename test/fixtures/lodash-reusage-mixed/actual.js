import _ from 'lodash';
import { map } from 'lodash';

const result1 = map([1, 2, 3], function() {});
const result2 = _.map([], function() {});
const result3 = map([], function() {});
const result4 = _.map([], function() {});
