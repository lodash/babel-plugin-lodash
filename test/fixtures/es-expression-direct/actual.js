import _ from 'lodash-es';

const method = _.identity || _.noop;

const method2 = _.noop ? _.map : _.filter;

_.noop;

(something ? _.pick : _.omit)(obj, () => {});
