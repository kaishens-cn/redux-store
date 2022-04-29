import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import {ReduxStoreProps, dispatch, start, connect, addModel} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <>
        <div onClick={() => {
            dispatch({
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

const TextViewConnect = connect(TextView, ['global']);
addModel(Global);

test('在reducer中重复调用reducer的场景', () => {
    render(start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('999')).not.toBeNull();
    expect(screen.queryByText('kai')).not.toBeNull();
})

const TextViewConnectOfSingleString = connect(TextView, 'global');

test('单namespace时的connect', () => {
    render(start(<TextViewConnectOfSingleString/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('888')).toBeNull();
    expect(screen.queryByText('kai')).toBeNull();
})
