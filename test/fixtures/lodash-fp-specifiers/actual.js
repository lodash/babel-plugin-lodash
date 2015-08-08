import {add, map, reject, take} from 'lodash-fp';

let mapper = map(add(1));
let result = mapper([1, 2, 3]);
take(1, reject(Boolean, result));