import { map, reject, take } from 'lodash';

const result = map([1, 2, 3], function() {});
take(reject(result), 1);
