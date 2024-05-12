import { userExampleValues } from '../../user/utils/user.constants'

export const authExampleValues = {
  signInTokenExpiration: 18000,

  isValid: true,
  realm: 'up_governance',

  user: {
    id: userExampleValues.id,
    name: userExampleValues.name,
    email: userExampleValues.email,
    roles: userExampleValues.roles,
  },
  expiresAt: '2021-01-01T03:00:00.000Z',
  accessToken: userExampleValues.accessToken,
  refreshToken: userExampleValues.refreshToken,
}

export const accessPermissionPayloadExample = {
  token: userExampleValues.accessToken,
}

export const accessPermissionResponseExample = {
  permission: true,
  user: {
    id: userExampleValues.id,
    name: userExampleValues.name,
    email: userExampleValues.email,
    roles: userExampleValues.roles,
    externalId: userExampleValues.externalId,
    organizationId: userExampleValues.organizationId,
    inactive: userExampleValues.inactive,
    createdAt: new Date(userExampleValues.createdAt),
    updatedAt: new Date(userExampleValues.updatedAt),
  },
}

export const accessPermissionValidationExample = {
  permission: false,
}
