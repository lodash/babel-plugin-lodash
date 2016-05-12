import fp from 'lodash/fp';

const mapper = fp.map(fp.add(1));
const result = mapper([-1, 0, 1]);
fp.take(1, fp.reject(Boolean, result));
