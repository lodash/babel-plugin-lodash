import _, { map, take } from 'lodash-compat';

let result = map([1, 2, 3], function() {});
take(_.reject(result), 1);
