import { map, reject, take } from 'lodash/fp';

let mapper = map(function() {});
let result = mapper([1, 2, 3]);
take(1, reject(Boolean, result));
