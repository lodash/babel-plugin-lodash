import parseForModules from 'lodash-modularize/dist/parseForModules';
import lodashModules from 'lodash-modularize/dist/lodashModules';

console.log(lodashModules);

export default function({ Plugin, types: t }) {
  return new Plugin("babel-lodash-modularize", {
    visitor: {
    }
  });
}
