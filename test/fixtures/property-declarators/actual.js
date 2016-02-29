import _, { kebabCase, camelCase } from 'lodash';

export const nameFormatters = {
  scss: kebabCase,
  json: camelCase,
  any: _.some
};