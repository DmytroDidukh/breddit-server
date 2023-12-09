import { ApolloServerErrorCode } from '@apollo/server/errors';

import { ErrorCode } from '../consts';

export type CombinedErrorCode = ErrorCode | ApolloServerErrorCode;
