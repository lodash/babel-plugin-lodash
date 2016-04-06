import { flow, map, camelCase } from 'lodash/fp';

let result = flow(map(camelCase), reverse)(['foo-bar', 'bar-baz', 'baz-quux']);
