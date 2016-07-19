import fp from 'lodash/fp';
import _ from 'lodash';

_.bind(func, _, 1);
fp.partial(func, fp, 1);
