import _ from 'lodash';

let result = _.map([1, 2, 3], function() {});
_.take(_.reject(result), 1);
