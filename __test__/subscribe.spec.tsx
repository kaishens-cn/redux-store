import React, {useEffect} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';

const TextView = (props: ReduxStoreProps) => {
    useEffect(() => {
        store.subscribe(() => {})
    }, [])

    return <>
        <div onClick={() => {
            store.dispatch({
                namespace: 'global',
                type: 'changeIdAndName',
            })
        }}>
            按钮
        </div>
        <div>{props.state?.global?.id}</div>
        <div>{props.state?.global?.name}</div>
    </>;
}

const TextViewConnect = store.connect(TextView);
store.addModel(Global);

test('使用redux订阅', () => {
    render(store.start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('999')).not.toBeNull();
    expect(screen.queryByText('kai')).not.toBeNull();
})

test('通过getState获取状态快照', () => {
    render(store.start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(store.getState<{ id: string }>().get('global')?.id).toBe('999');
})
