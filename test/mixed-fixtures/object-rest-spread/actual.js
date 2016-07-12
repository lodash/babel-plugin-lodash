import { keys } from 'lodash';

const object1 = { 'a': 1 };
const object2 = { 'b': 2, 'c': 3 };
const object3 = { ...object1, ...object2 };
const { b: foo, ...bar } = object3;

keys(bar);
