import _, { map, take } from 'lodash-compat';

const result = map([1, 2, 3], function() {});
take(_.reject(result), 1);
