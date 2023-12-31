import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../context';
import { AuthenticationError } from '../graphql/types';

const AuthenticationMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new AuthenticationError();
    }

    return next();
};

export { AuthenticationMiddleware };
