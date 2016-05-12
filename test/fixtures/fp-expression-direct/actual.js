import _ from 'lodash/fp';

const method1 = _.identity || _.noop;
const method2 = _.noop ? _.map : _.filter;

(something ? _.pick : _.omit)(function() {

}, obj);
