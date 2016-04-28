import lodash from 'lodash-es';

const method = lodash.identity || lodash.noop;

const method2 = lodash.noop ? lodash.map : lodash.filter;

(something ? lodash.pick : lodash.omit)(obj, function() {

});
