import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <div onClick={async () => {
        try {
            store.dispatch({
                namespace: 'global',
                type: 'emitError',
                payload: {
                    id: '666',
                },
            });
        } catch (e) {
        }
        try {
            await store.dispatch({
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

const TextViewConnect = store.connect(TextView);
store.addModel(Global);

test('reducer中发生异常的情况', () => {
    render(store.start(<TextViewConnect/>));

    fireEvent.click(screen.getByText('100'));
    expect(screen.queryByText('666')).toBeNull();
})
