import _ from 'lodash';

const method1 = _.identity || _.noop;
const method2 = _.noop ? _.map : _.filter;

(something ? _.pick : _.omit)(obj, function() {

});
