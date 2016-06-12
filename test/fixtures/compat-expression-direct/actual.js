import _ from 'lodash-compat';

const method1 = _.identity || _.noop;
const method2 = _.noop ? _.map : _.filter;

(something ? _.pick : _.omit)(obj, () => {});
