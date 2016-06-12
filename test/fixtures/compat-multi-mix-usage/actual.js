import _, { map, take } from 'lodash-compat';

const result = map([1, 2, 3], () => {});
take(_.reject(result), 1);
