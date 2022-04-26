import React from 'react';
import {render, screen} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';

const TextView = (props: ReduxStoreProps) => {
    return <div>{props.state.global.id}</div>;
}

const TextViewConnect = store.connect(TextView);
store.addModel(Global);

test('@states', () => {
    render(store.start(<TextViewConnect/>))
    expect(screen.queryByText('100')).not.toBeNull();
});

