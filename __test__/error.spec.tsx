import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import {ReduxStoreProps, dispatch, start, connect, addModel} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <div onClick={async () => {
        try {
            dispatch({
                namespace: 'global',
                type: 'emitError',
                payload: {
                    id: '666',
                },
            });
        } catch (e) {
        }
        try {
            await dispatch({
                namespace: 'global',
                type: 'emitPromiseError',
                payload: {
                    id: '666',
                },
            });
        } catch (e) {
        }
    }}>
        {props.state.global.id}
    </div>;
}

const TextViewConnect = connect(TextView);
addModel(Global);

test('reducer中发生异常的情况', () => {
    render(start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('100'));
    expect(screen.queryByText('666')).toBeNull();
})
