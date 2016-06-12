import _ from 'lodash-es';

const method = _.identity || _.noop;

const method2 = _.noop ? _.map : _.filter;

(something ? _.pick : _.omit)(obj, () => {});
