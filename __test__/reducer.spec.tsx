import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <>
        <div onClick={() => {
            store.dispatch({
                namespace: 'global',
                type: 'changeIdAndName'
            })
        }}>
            按钮
        </div>
        <div>{props.state?.global?.id}</div>
        <div>{props.state?.global?.name}</div>
    </>;
}

const TextViewConnect = store.connect(TextView, ['global']);
store.addModel(Global);

test('在reducer中重复调用reducer的场景', () => {
    render(store.start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('888')).not.toBeNull();
    expect(screen.queryByText('kai')).not.toBeNull();
})

const TextViewConnectOfSingleString = store.connect(TextView, 'global');

test('单namespace时的connect', () => {
    render(store.start(<TextViewConnectOfSingleString/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('888')).toBeNull();
    expect(screen.queryByText('kai')).toBeNull();
})
