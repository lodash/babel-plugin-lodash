import fp from 'lodash/fp'

let c = fp.flowRight(fp.capitalize, fp.head);

c(['a', 'b']);
