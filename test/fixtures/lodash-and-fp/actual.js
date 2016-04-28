import _, { map, take } from 'lodash';
import fp, { map as fmap, take as ftake } from 'lodash/fp';

const mapper = fmap(fp.add(1));
const result = mapper([1, 2, 3]);
ftake(1, fp.reject(Boolean, result));

const result2 = map([1, 2, 3], function() {});
take(_.reject(result), 1);
