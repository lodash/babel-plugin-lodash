import fp, { map, take } from 'lodash/fp';

const mapper = map(fp.add(1));
const result = mapper([1, 2, 3]);
take(1, fp.reject(Boolean, result));
