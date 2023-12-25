import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../context';
import { AuthorizationError } from '../graphql/types';

const AuthorizationMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new AuthorizationError();
    }

    return next();
};

export { AuthorizationMiddleware };
