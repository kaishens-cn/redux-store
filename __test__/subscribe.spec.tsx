import React, {useEffect} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import {ReduxStoreProps, dispatch, start, connect, addModel, subscribe, getState} from '../src';

const TextView = (props: ReduxStoreProps) => {
    useEffect(() => {
        subscribe(() => {})
    }, [])

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

const TextViewConnect = connect(TextView);
addModel(Global);

test('使用redux订阅', () => {
    render(start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(screen.queryByText('999')).not.toBeNull();
    expect(screen.queryByText('kai')).not.toBeNull();
})

test('通过getState获取状态快照', () => {
    render(start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('按钮'));
    expect(getState<{ id: string }>().get('global')?.id).toBe('999');
})
