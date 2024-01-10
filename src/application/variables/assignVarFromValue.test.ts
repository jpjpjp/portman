import { getOasMappedOperation } from '../../../__tests__/testUtils/getOasMappedOperation'
import { getPostmanMappedOperation } from '../../../__tests__/testUtils/getPostmanMappedOperation'
import { assignVarFromValue } from '../../application'
import { OasMappedOperation } from '../../oas'
import { PostmanMappedOperation } from '../../postman'
import { GlobalConfig } from '../../types'

describe('assignVarFromValue', () => {
  let oasOperation: OasMappedOperation
  let pmOperation: PostmanMappedOperation

  beforeEach(async () => {
    pmOperation = await getPostmanMappedOperation()
    oasOperation = await getOasMappedOperation()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should add postman collection var without name for string value', async () => {
    const varSetting = {
      value: 'portman'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should add postman collection var with name for string value', async () => {
    const varSetting = {
      value: 'portman',
      name: 'portman_string'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should add postman collection var with name for boolean value', async () => {
    const varSetting = {
      value: true,
      name: 'portman_boolean'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 2)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should add postman collection var with name for number value', async () => {
    const varSetting = {
      value: 12345,
      name: 'portman_number'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 3)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should show the log output for add postman collection var without name for string value', async () => {
    const varSetting = {
      value: 'portman'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1, {
      logAssignVariables: true
    })
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should not show the log output for add postman collection var without name for string value', async () => {
    const varSetting = {
      value: 'portman'
    }
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1, {
      logAssignVariables: false
    })
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should generate a variable and convert the casing for the variable name', async () => {
    const varSetting = {
      value: 'portman'
    }
    const settings = { variableCasing: 'snakeCase' } as GlobalConfig
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1, {}, settings)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })

  it('should generate a variable and not convert the casing for the variable name', async () => {
    const varSetting = {
      value: 'portman'
    }
    const settings = {} as GlobalConfig
    pmOperation = assignVarFromValue(varSetting, pmOperation, oasOperation, 1, {}, settings)
    const pmTest = pmOperation.getTests()
    expect(pmTest.script.exec).toMatchSnapshot()
  })
})
