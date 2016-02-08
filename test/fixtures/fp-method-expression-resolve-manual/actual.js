import {filter, identity, map, noop, pick, omit} from 'lodash/fp';

let method = identity || noop;

let method2 = noop ? map : filter;

(something ? pick : omit)(function() {

}, obj);
