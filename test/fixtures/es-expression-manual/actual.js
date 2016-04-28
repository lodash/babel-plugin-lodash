import { filter, identity, map, noop, pick, omit } from 'lodash-es';

const method1 = identity || noop;
const method2 = noop ? map : filter;

(something ? pick : omit)(obj, function() {

});
