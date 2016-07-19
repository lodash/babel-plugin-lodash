import _, { map, take } from 'lodash-compat';

const result = map([], n => _.add(1, n));
take(_.reject(result), 1);
