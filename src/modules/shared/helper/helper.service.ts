import { ApiRequestContext } from '../contextRequest/contextRequest.interface'
import { RequestContext } from '@medibloc/nestjs-request-context'
import { ContentType } from './utils/helper.enum'
import { RequestHeader } from './dto/helper.dto'
import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'
import { Types } from 'mongoose'

@Injectable()
export class HelperService {
  constructor() {}

  async getContextHeaders() {
    const apiRequestContext: ApiRequestContext = RequestContext.get()

    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `${apiRequestContext.authorization}`,
    }
    return headersRequest
  }

  async getOrganizationId() {
    const apiRequestContext: ApiRequestContext = RequestContext.get()
    return apiRequestContext.organizationId
  }

  async getUserId() {
    const apiRequestContext: ApiRequestContext = RequestContext.get()
    return apiRequestContext.userId
  }

  async getUserName() {
    const apiRequestContext: ApiRequestContext = RequestContext.get()
    return apiRequestContext.userName
  }

  async getUserEmail() {
    const apiRequestContext: ApiRequestContext = RequestContext.get()
    return apiRequestContext.userEmail
  }

  getHeaders() {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TOKEN_HLG}`,
    }
    return headersRequest
  }

  buildMongoQuery(
    querySearch: Record<string, any> = {},
    splitFields: string[] = [],
    customQuery: Record<string, any> = {},
  ): Record<string, any> {
    if (Array.isArray(splitFields) && splitFields.length) {
      querySearch = splitFields.reduce((acc, field) => {
        if (acc[field]) {
          acc[field] =
            typeof acc[field] === 'string'
              ? this.splitString(acc[field], ',')
              : acc[field]
        }
        return acc
      }, querySearch)
    }

    let query = {}

    const configProperty = {
      id: '_id',
    }

    Object.keys(querySearch).forEach((field) => {
      let desiredValue = querySearch[field]

      if (desiredValue) {
        const desiredField = configProperty[field] || field

        switch (true) {
          case Array.isArray(desiredValue):
            if (desiredField === configProperty.id) {
              desiredValue = desiredValue.filter((id: string) =>
                Types.ObjectId.isValid(id),
              )
            }

            query[desiredField] = { $in: desiredValue }
            break

          case typeof desiredValue === 'boolean':
          case typeof desiredValue === 'string':
          default:
            query[desiredField] = desiredValue
            break
        }
      }
    })

    query = Object.assign(query, { ...customQuery, deletedAt: null })

    return query
  }

  splitString(text: string, separator: string): string[] {
    return text.split(separator).reduce((acc: string[], id: string) => {
      if (id) acc.push(id.replace(/\s/g, ''))
      return acc
    }, [])
  }

  isValidDate(date: string, format: string): boolean {
    return moment(date, format, true).isValid()
  }

  setFormatFirstHour(date: Date) {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  setFormatLastHour(date: Date) {
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(59)
    return date
  }

  addSecondsToDate(date: Date, timeInSecondsToAdd: number) {
    date.setTime(date.getTime() + timeInSecondsToAdd * 1000)
    return date
  }

  formatKeyUsingAPublicKeyPattern(key: string) {
    return `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----\n`
  }

  formatKeyUsingRSAPrivateKeyPattern(key: string) {
    return `-----BEGIN RSA PRIVATE KEY-----\n${key}\n-----END RSA PRIVATE KEY-----\n`
  }

  setRequestHeaderWithAuthorizationClause(token: string): RequestHeader {
    return {
      'Content-Type': ContentType.APPLICATION_JSON,
      Authorization: `Bearer ${token}`,
    }
  }

  setRequestHeaderForUrlencodedPayload(): RequestHeader {
    return {
      'Content-Type': ContentType.APPLICATION_URLENCODED,
    }
  }

  getTheDifferenceInSecondsBewteenDates(initialDate: Date, finalDate: Date) {
    const differenceInSeconds = Math.abs(
      (finalDate.getTime() - initialDate.getTime()) / 1000,
    )

    return Math.ceil(differenceInSeconds)
  }

  getTheExpirationTimeInSecondsOfJwtToken(token: string) {
    const decodedToken: any = jwt.decode(token)

    if (!decodedToken?.exp) return null

    const expirationDateOfToken = new Date(decodedToken.exp * 1000)
    const currentDate = new Date()

    return this.getTheDifferenceInSecondsBewteenDates(
      currentDate,
      expirationDateOfToken,
    )
  }

  getTheMinimumExpirationTimeInSecondsBetweenTokens(
    externalToken: string,
    internalToken: string,
  ) {
    const externalTokenExpirationTime =
      this.getTheExpirationTimeInSecondsOfJwtToken(externalToken)

    const internalTokenExpirationTime =
      this.getTheExpirationTimeInSecondsOfJwtToken(internalToken)

    return externalTokenExpirationTime && internalTokenExpirationTime
      ? Math.min(externalTokenExpirationTime, internalTokenExpirationTime)
      : null
  }
}
