import { keys } from 'lodash';

const o1 = { 'a': 1 };
const o2 = { 'b': 2, 'c': 3 };
const o3 = { ...o1, ...o2 };
const { b: foo, ...bar } = o3;

keys(bar);
