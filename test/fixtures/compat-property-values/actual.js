import _, { camelCase, kebabCase } from 'lodash-compat';

export const formatters = {
  camelCase,
  'kebabCase': kebabCase,
  'snakeCase': _.snakeCase
};
