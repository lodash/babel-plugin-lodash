import { callExpression, identifier } from '@babel/types'

import importModule from './importModule'

/** The error message used when unterminated chain sequences are detected. */
const UNTERMINATED_CHAIN_ERROR = [
  'Unterminated Lodash chain sequences are not supported by babel-plugin-lodash.',
  'Consider substituting chain sequences with composition patterns.',
  'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'
].join('\n')

/*----------------------------------------------------------------------------*/

export default function resolveChainCall(pkgStore, chainCallPath) {
  let nestedCallArgument = chainCallPath.node.arguments[0]
  let nextCallPath = chainCallPath
  let nextMemberPath
  let nextMemberName

  while (
    (nextMemberPath = nextCallPath.parentPath).isMemberExpression() &&
    (nextCallPath = nextMemberPath.parentPath).isCallExpression()
  ) {
    nextMemberName = nextMemberPath.node.property.name;

    if (nextMemberName === 'value') {
      nextCallPath.replaceWith(nestedCallArgument)
      return
    }
    else {
      const { name } = importModule(pkgStore, nextMemberName, nextCallPath)
      nestedCallArgument = callExpression(identifier(name), [nestedCallArgument, ...nextCallPath.node.arguments])
      nextMemberPath.parentPath.replaceWith(nestedCallArgument)
    }
  }

  throw nextMemberPath.buildCodeFrameError(UNTERMINATED_CHAIN_ERROR)
}
