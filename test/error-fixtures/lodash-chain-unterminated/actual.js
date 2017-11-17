import _ from 'lodash';

const chain = _.chain([])
  .map(n => _.add(1, n))
  .reject()
  .take(1);
