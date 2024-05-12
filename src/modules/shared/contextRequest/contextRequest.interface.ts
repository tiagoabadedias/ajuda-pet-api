import { RequestContext } from '@medibloc/nestjs-request-context'

export class ApiRequestContext extends RequestContext {
  organizationId: string
  authorization: any
  userId: string
  userEmail: string
  userName: string
}
