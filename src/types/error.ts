import { ApolloServerErrorCode } from '@apollo/server/src/errors';

import { ErrorCode } from '../consts';

export type CombinedErrorCode = ErrorCode | ApolloServerErrorCode;
