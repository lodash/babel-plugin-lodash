import fp, { kebabCase, camelCase } from 'lodash/fp';

export const nameFormatters = {
  camelCase: camelCase,
  kebabCase: kebabCase,
  some: fp.some
};
