import _, { camelCase, kebabCase } from 'lodash';

export const formatters = {
  camelCase,
  'kebabCase': kebabCase,
  'snakeCase': _.snakeCase
};
