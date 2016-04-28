import { map, reject, take } from 'lodash/fp';

const mapper = map(function() {});
const result = mapper([1, 2, 3]);
take(1, reject(Boolean, result));
