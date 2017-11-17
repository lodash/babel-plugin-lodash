import { chain } from 'lodash';

const result = chain([])
  .map()
  .reject()
  .take(1)
  .value();
