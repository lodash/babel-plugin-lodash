import fp, { kebabCase, camelCase } from 'lodash/fp';

export const nameFormatters = {
  kebabCase: kebabCase,
  camelCase: camelCase,
  some: fp.some
};
