import {noop, range} from 'lodash';

function myFunc() {}

myFunc(range, noop);
myFunc(noop, noop);
myFunc(range, noop, noop);
myFunc(range, noop, range, noop);
myFunc(range, noop, range, noop, range);
