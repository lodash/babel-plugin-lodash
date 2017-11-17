import _ from 'lodash';

const result = _.chain([])
  .map(n => _.add(1, n))
  .reject()
  .take(1)
  .value();
