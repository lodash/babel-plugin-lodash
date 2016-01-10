import fp from 'lodash-fp'

let c = fp.compose(fp.capitalize, fp.head);

c(['a', 'b']);
