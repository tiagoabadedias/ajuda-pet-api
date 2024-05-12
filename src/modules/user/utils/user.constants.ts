export const userExampleValues = {
  id: '6245f85c6952f1cde2558455',
  accessToken: '',
  refreshToken: '',
  role: 'admin',
  roles: ['admin'],
  externalId: '27ry9634t',
  email: 'test@test.com',
  name: 'user_name',
  organizationId: '62a37e90cb5e6f32ad65508d',
  password: 'c2cb2@f78#ba718',
  realm: 'backoffice',
  encryptedPassword:
    '$2b$10$44HLL8d7z39Qho2iLPI9TOuVl/I4xveJsHI3/OrTpR6YL/zwbkz4G',
  inactive: false,
  resetPasswordToken: '92db50f45a',
  nullResetPassword: null,
  resetTokenExpiration: 1800,
  permission: ['admin'],
  createdAt: '2021-01-01T03:00:00.000Z',
  updatedAt: '2021-01-01T03:00:00.000Z',
}

export const userPaginatedExampleValues = {
  items: [
    {
      id: '6245f85c6952f1cde2558455',
      roles: 'admin',
      externalId: '27ry9634t',
      authenticatorId: 'fb4350d5-bc39-4ff7-b5eb-31916490a053',
      email: 'test@test.com',
      name: 'user_name',
      inactive: false,
      createdAt: '2021-01-01T03:00:00.000Z',
      updatedAt: '2021-01-01T03:00:00.000Z',
    },
  ],
  meta: {
    totalItems: 3,
    itemCount: 3,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
}
