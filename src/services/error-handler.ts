import { GraphQLFormattedError } from 'graphql';

export class ErrorHandlerService {
    public handleErrors(formattedError: GraphQLFormattedError): GraphQLFormattedError {
        // TODO: Add error handling logic here
        switch (formattedError.extensions?.code) {
            default:
                return formattedError;
        }
    }
}
