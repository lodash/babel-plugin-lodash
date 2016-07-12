import fs from 'fs';
import { concat } from 'async';
import { add, map, reject, take } from 'lodash-bound';
import R, { map as rmap, take as rtake } from 'ramda';

const object = { 'a': -1, 'b': 0, 'c': 1 };

concat(['a', 'b', 'c'], fs.readdir, (error, files) => console.log(files));

const result = object::map(n => 1::add(n));
result::reject()::take(1);

const mapper = rmap(R.add(1));
const result2 = mapper(object);
rtake(1, R.values(R.reject(Boolean, result2)));
