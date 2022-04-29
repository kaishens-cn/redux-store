import {Store, legacy_createStore} from 'redux';
import {Provider, connect} from 'react-redux'
import * as React from 'react';
import {Map} from 'immutable';

type Constructor = { new(...args: any[]): any };

interface TargetModel {
    [propsName: string]: {
        asyncReducers: string[],
        reducers: string[],
        states: string[],
    }
}

let target_namespace = '';

const target_model: TargetModel = {};

export const asyncReducers = () => {
    return (target: Object, property_key: string) => {
        target_model[target_namespace].asyncReducers.push(property_key);
    }
}

export const reducers = () => {
    return (target: Object, property_key: string) => {
        target_model[target_namespace].reducers.push(property_key);
    }
}

export const states = () => {
    return (target: Object, property_key: string) => {
        target_model[target_namespace].states.push(property_key);
    }
}

export const namespaces = (name: string) => {
    target_namespace = name;
    target_model[target_namespace] = {
        asyncReducers: [],
        reducers: [],
        states: [],
    };
    return <T extends Constructor>(BaseClass: T) => {
        return class extends BaseClass {
            namespace: string = name;
        };
    }
}

interface SelfObject<T> {
    [propsName: string]: T,
}

interface Action<T> {
    namespace: string,
    type: string,
    payload: SelfObject<T>,
}

interface ActionList {
    [propsNames: string]: {
        type: 'asyncReducers' | 'reduces',
        action: Function,
    }
}

const actions: ActionList = {};

let default_state = Map({});

interface DispatchParams<T> {
    namespace: string
    type: string
    payload?: SelfObject<T>
}

export class Context {
    payload: any;

    constructor(payload: any) {
        this.payload = payload;
        this.dispatch = dispatch;
    }

    dispatch<T, >(_action: DispatchParams<T>): Promise<void> | void {
        return
    }
}

export interface ReduxStoreProps {
    state?: any
    dispatch?<T>(params: DispatchParams<T>): any
}

const reducer = <T, >(state: any = default_state, action: Action<T>): SelfObject<T> => {
    if (action.namespace) {
        let new_state = state;
        for (const key in action.payload[action.namespace]) {
            new_state = new_state.updateIn([action.namespace, key], () => action.payload[action.namespace][key])
        }
        return new_state;
    } else {
        return state;
    }
}

let _store: Store;

const createStore = (reducer: any) => {
    if (!_store) {
        _store = legacy_createStore(reducer);
    }
    return _store;
}

const reduxConnect = (_class: any, namespace?: string | string[]) => {
    return connect((state: Map<string, unknown>) => {
        const {dispatch, getState, replaceReducer, subscribe} = _store;
        if (namespace instanceof Array) {
            const tmp_state: { [propsName: string]: unknown } = {};
            for (const item of namespace) {
                tmp_state[item] = state.get(item);
            }
            return {state: tmp_state, dispatch, getState, replaceReducer, subscribe};
        }
        if (typeof namespace === 'string') {
            return {state: state.get(namespace), dispatch, getState, replaceReducer, subscribe};
        }
        return {state: state.toJS(), dispatch, getState, replaceReducer, subscribe};
    })(_class)
};

const start = (Root: React.ReactElement) => {
    const store = createStore(reducer);
    return <Provider store={store}>
        {Root}
    </Provider>;
}

const addModel = <T extends Constructor>(target: T) => {
    const tmp = new target.prototype.constructor();
    // 处理model
    const state: SelfObject<{ [propsName: string]: any }> = {
        [tmp.namespace]: {},
    };
    for (const item of target_model[tmp.namespace].states) {
        state[tmp.namespace][item] = tmp[item];
    }

    for (const item of target_model[tmp.namespace].asyncReducers) {
        actions[`${tmp.namespace}/${item}`] = {
            type: 'asyncReducers',
            action: tmp[item].bind(tmp),
        }
    }

    for (const item of target_model[tmp.namespace].reducers) {
        actions[`${tmp.namespace}/${item}`] = {
            type: 'reduces',
            action: tmp[item].bind(tmp),
        }
    }

    default_state = default_state.mergeDeep(state);
}

export class Models {
    constructor() {
    }
    // 以便于未来可以增加一个实用性的工具函数放到这里
}

const subscribe = (listener: () => void) => {
    if (_store) {
        _store.subscribe(listener)
    }
    listener();
}

const getState = <T,>(): Map<string, T> => {
    if (_store) {
        return _store.getState();
    }
    return Map({});
}

const dispatch = <T, >(action: DispatchParams<T>): Promise<void> | void => {
    if (!actions.hasOwnProperty(`${action.namespace}/${action.type}`)) {
        // 没找到action的情况
        console.warn(`不存在名为：${action.namespace}/${action.type} 的reducer`)
        return
    }
    if (actions[`${action.namespace}/${action.type}`].type === 'asyncReducers') {
        // 处理异步状况
        const ctx = new Context(action.payload);
        return new Promise((resolve, reject) => {
            // 对异常情况都不更新状态
            actions[`${action.namespace}/${action.type}`].action(ctx).then((res: any) => {
                if (_store) {
                    _store.dispatch({
                        namespace: action.namespace,
                        type: 'asyncReducers',
                        payload: {
                            [action.namespace]: res,
                        },
                    });
                    resolve();
                }
            }).catch((e: any) => {
                reject(e);
            })
        })
    }
    if (actions[`${action.namespace}/${action.type}`].type === 'reduces') {
        const ctx = new Context(action.payload);
        const res = actions[`${action.namespace}/${action.type}`].action(ctx);
        if (_store) {
            _store.dispatch({
                namespace: action.namespace,
                type: 'asyncReducers',
                payload: {
                    [action.namespace]: res,
                },
            });
        }
    }
}

export {
    start,
    addModel,
    reduxConnect as connect,
    subscribe,
    getState,
    dispatch,
}
