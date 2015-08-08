import fp, {map, take} from 'lodash-fp';

let mapper = map(fp.add(1));
let result = mapper([1, 2, 3]);
take(1, fp.reject(Boolean, result));