import React, {useEffect} from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <div onClick={() => {
        store.dispatch({
            namespace: 'global',
            payload: {id: '666'},
            type: 'changeId',
        })
    }}>{props.state.global.id}</div>;
}

const TextViewRenderOfApi = (props: ReduxStoreProps) => {
    useEffect(() => {
        const fetchId = async () => {
            await store.dispatch({
                namespace: 'global',
                payload: {apiId: '777'},
                type: 'getIdUseApi',
            });
        }
        fetchId().then();
    }, []);

    return <div>{props.state.global.apiId}</div>;
}

const TextViewConnect = store.connect(TextView);
const TextViewRenderOfApiConnect = store.connect(TextViewRenderOfApi);
store.addModel(Global);

test('初始化状态以及通过reducer改变状态', async () => {
    await act(async () => {
        render(store.start(<>
            <TextViewConnect/>
            <TextViewRenderOfApiConnect/>
        </>));
    });
    expect(screen.getByText('100')).not.toBeNull();

    const divDom = screen.getByText('100');
    fireEvent.click(divDom);

    expect(screen.getByText('666')).not.toBeNull();
    expect(screen.getByText('777')).not.toBeNull();
});

