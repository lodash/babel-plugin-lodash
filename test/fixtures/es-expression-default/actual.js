import _ from 'lodash-es';

const func1 = _.identity || _.noop;
const func2 = _.noop ? _.map : _.filter;

_.noop;

(bool ? _.omit : _.pick)(object);
