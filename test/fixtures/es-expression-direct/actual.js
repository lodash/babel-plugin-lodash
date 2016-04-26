import lodash from 'lodash-es';

let method = lodash.identity || lodash.noop;

let method2 = lodash.noop ? lodash.map : lodash.filter;

(something ? lodash.pick : lodash.omit)(obj, function() {

});
