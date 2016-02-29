import fp, { kebabCase, camelCase } from 'lodash/fp';

export const nameFormatters = {
  scss: kebabCase,
  json: camelCase,
  any: fp.some
};