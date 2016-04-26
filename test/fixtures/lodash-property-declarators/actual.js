import _, { kebabCase, camelCase } from 'lodash';

export const nameFormatters = {
  camelCase: camelCase,
  kebabCase: kebabCase,
  some: _.some
};
