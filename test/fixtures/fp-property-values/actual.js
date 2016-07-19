import fp, { camelCase, kebabCase } from 'lodash/fp';

export const formatters = {
  camelCase,
  'kebabCase': kebabCase,
  'snakeCase': fp.snakeCase
};
