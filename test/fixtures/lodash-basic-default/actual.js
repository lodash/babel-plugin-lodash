import _ from 'lodash';

const result = _.map([], n => _.add(1, n));
_.take(_.reject(result), 1);
