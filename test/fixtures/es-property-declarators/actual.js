import _, { kebabCase, camelCase } from 'lodash-es';

export const nameFormatters = {
  camelCase: camelCase,
  kebabCase: kebabCase,
  some: _.some
};
