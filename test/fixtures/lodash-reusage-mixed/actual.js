import _ from 'lodash';
import { map } from 'lodash';

let result = map([1, 2, 3], function() {});
let result2 = _.map([], function() {});
let result3 = map([], function() {});
let result4 = _.map([], function() {});
