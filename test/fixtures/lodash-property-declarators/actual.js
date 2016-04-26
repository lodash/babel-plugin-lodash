import _, { kebabCase, camelCase } from 'lodash';

export const nameFormatters = {
  kebabCase: kebabCase,
  camelCase: camelCase,
  some: _.some
};
