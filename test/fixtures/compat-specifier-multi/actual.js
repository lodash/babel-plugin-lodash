import { map, reject, take } from 'lodash-compat';

let result = map([1, 2, 3], function() {});
take(reject(result), 1);
