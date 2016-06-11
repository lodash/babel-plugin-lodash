import { add, map, take } from 'lodash-bound';
import R, { map as rmap, take as rtake } from 'ramda';

const mapper = rmap(R.add(1));
const result = mapper([-1, 0, 1]);
ftake(1, R.reject(Boolean, result));

const result2 = map::({ 'a': -1, 'b': 0, 'c': 1 }, n => 1::add(n));
result::reject(Boolean)::take(1);
