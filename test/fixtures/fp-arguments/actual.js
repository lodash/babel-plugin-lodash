import { capitalize, compose, head, map } from 'lodash/fp';

compose(map(capitalize), head)([]);
