import { merge } from 'lodash';

function foo(object) {
  return merge(object, { 'a': 1 });
}
