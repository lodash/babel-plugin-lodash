import { add, map, take } from 'lodash-bound';
import R, { map as rmap, take as rtake } from 'ramda';

const object = { 'a': -1, 'b': 0, 'c': 1 };

const mapper = rmap(R.add(1));
const result = mapper(object);
ftake(1, R.values(R.reject(Boolean, result)));

const result2 = object::map(n => 1::add(n));
result2::reject()::take(1);
