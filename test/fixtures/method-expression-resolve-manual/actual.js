import {filter, identity, map, noop, pick, omit} from 'lodash';

let method = identity || noop;

let method2 = noop ? map : filter;

(something ? pick : omit)(obj, function() {

});
