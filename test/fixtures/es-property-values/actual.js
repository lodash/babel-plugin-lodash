import _, { camelCase, kebabCase } from 'lodash-es';

export const formatters = {
  camelCase,
  'kebabCase': kebabCase,
  'snakeCase': _.snakeCase
};
