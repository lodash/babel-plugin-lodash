import fp from 'lodash-fp';

let mapper = fp.map(fp.add(1));
let result = mapper([1, 2, 3]);
fp.take(1, fp.reject(Boolean, result));
