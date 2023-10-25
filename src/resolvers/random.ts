import { Query, Resolver } from 'type-graphql';

@Resolver()
export class RandomResolver {
    @Query(() => String)
    hello() {
        return 'hello world';
    }
}
