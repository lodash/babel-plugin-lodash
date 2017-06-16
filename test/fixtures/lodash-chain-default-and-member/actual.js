import _, { chain } from 'lodash';

const result = chain([])
  .map(n => _.add(1, n))
  .reject()
  .take(1)
  .value();
