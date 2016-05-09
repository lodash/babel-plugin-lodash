import { merge } from 'lodash';

function foo(a) {
  return merge(a, { 'b': 1 });
}
