import {states, namespaces, Models, reducers, Context, asyncReducers} from '../src';

@namespaces('global')
export class Global extends Models {
    @states()
    id: string = '100';

    @states()
    name: string = '';

    @states()
    apiId: string = '';

    // 普通reducer
    @reducers()
    changeId(ctx: Context) {
        const {id} = ctx.payload;
        return {id};
    }

    @reducers()
    changeName(ctx: Context) {
        const {name} = ctx.payload;
        return {name};
    }

    // 异步reducer
    @asyncReducers()
    async getIdUseApi(ctx: Context) {
        const {apiId} = ctx.payload;
        return {apiId};
    }

    @reducers()
    changeIdAndName(ctx: Context) {
        ctx.dispatch({
            type: 'changeId',
            namespace: 'global',
            payload: {
                id: '888',
            }
        });
        ctx.dispatch({
            type: 'changeName',
            namespace: 'global',
            payload: {
                name: 'kai',
            }
        });
    }
}
