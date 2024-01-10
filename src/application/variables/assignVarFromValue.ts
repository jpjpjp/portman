import { writeOperationTestScript } from '../../application'
import { OasMappedOperation } from '../../oas'
import { PostmanMappedOperation } from '../../postman'
import { CollectionVariableConfig, GlobalConfig, PortmanOptions } from '../../types'
import { generateVarName } from '../../utils'

/**
 * Assign PM variable with value defined by a fixed value, defined the portman config
 * @param varSetting
 * @param pmOperation
 * @param oaOperation
 * @param fixedValueCounter
 * @param options
 * @param settings
 */
export const assignVarFromValue = (
  varSetting: CollectionVariableConfig,
  pmOperation: PostmanMappedOperation,
  oaOperation: OasMappedOperation | null,
  fixedValueCounter: number | string,
  options?: PortmanOptions,
  settings?: GlobalConfig
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
): PostmanMappedOperation => {
  // Early exit if request body is not defined
  if (!varSetting.value) return pmOperation

  let pmVarAssign = ''

  // Toggle log output
  const toggleLog = options?.logAssignVariables === false ? '// ' : ''

  // Set variable name
  const opsRef = pmOperation.id ? pmOperation.id : pmOperation.pathVar
  const varProp = `-var-` + fixedValueCounter
  // const defaultVarName = `${opsRef}.${varProp}`
  // const casedVarName = settings?.variableCasing
  //   ? changeCase(defaultVarName, settings.variableCasing)
  //   : defaultVarName

  // Generate dynamic variable name
  const casedVarName = generateVarName({
    oaOperation,
    dynamicValues: {
      varProp: varProp,
      opsRef: opsRef
    },
    options: {
      casing: settings?.variableCasing
    }
  })

  const varName = varSetting?.name ?? casedVarName
  const varValue = typeof varSetting.value === 'string' ? `"${varSetting.value}"` : varSetting.value

  pmVarAssign = [
    `// pm.collectionVariables - Set fixed value for ${varName} variable \n`,
    `pm.collectionVariables.set("${varName}", ${varValue});\n`,
    `${toggleLog}console.log("- use {{${varName}}} as collection variable for value", ${varValue});\n`
  ].join('')

  // Expose the variable in Portman
  console.log(`- Set variable for "${opsRef}" - use {{${varName}}} as variable for ${varValue}`)

  writeOperationTestScript(pmOperation, pmVarAssign)

  return pmOperation
}
