import _, { map, take } from 'lodash';
import fp, { map as fmap, take as ftake } from 'lodash/fp';

let mapper = fmap(fp.add(1));
let result = mapper([1, 2, 3]);
ftake(1, fp.reject(Boolean, result));

let result2 = map([1, 2, 3], function() {});
take(_.reject(result), 1);
