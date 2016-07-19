import { add, map, reject, take } from 'lodash/fp';

const mapper = map(add(1));
const result = mapper([]);
take(1, reject(Boolean, result));
