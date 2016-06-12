import { map, reject, take } from 'lodash';

const result = map([1, 2, 3], () => {});
take(reject(result), 1);
