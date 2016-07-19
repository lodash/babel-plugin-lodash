import _, { map, take } from 'lodash';
import fp, { map as fmap, take as ftake } from 'lodash/fp';

const mapper = fmap(fp.add(1));
const result = mapper([]);
ftake(1, fp.reject(Boolean, result));

const result2 = map([], n => _.add(1, n));
take(_.reject(result2), 1);
