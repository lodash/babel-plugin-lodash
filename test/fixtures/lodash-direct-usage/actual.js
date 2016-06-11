import _ from 'lodash';

const result = _.map([-1, 0, 1], n => _.add(1, n));
_.take(_.reject(result, Boolean), 1);
