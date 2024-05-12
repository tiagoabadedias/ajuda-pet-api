import { RequestParamsDto } from "./dto/abstract.requestFactory.dto";

export abstract class AbstractRequestFactory {
  abstract request(config: RequestParamsDto): Promise<any>
}