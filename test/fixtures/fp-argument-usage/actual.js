import { compose, first, map, toUpper } from 'lodash/fp';

const c = compose(map(toUpper), first);

c(['a', 'b']);
