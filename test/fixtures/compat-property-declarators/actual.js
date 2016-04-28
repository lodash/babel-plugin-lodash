import _, { kebabCase, camelCase } from 'lodash-compat';

export const nameFormatters = {
  camelCase: camelCase,
  kebabCase: kebabCase,
  some: _.some
};
