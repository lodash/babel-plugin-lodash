import { compose, first, map, toUpper } from 'lodash/fp';

let c = compose(map(toUpper), first);

c(['a', 'b']);
