import _ from 'lodash';

const result = _.map([1, 2, 3], function() {});
_.take(_.reject(result), 1);
