import React, {PureComponent} from 'react';
import {render, screen} from '@testing-library/react';
import {Global} from './global';
import store, {ReduxStoreProps} from '../src';


class TextView extends PureComponent<ReduxStoreProps> {
    render() {
        return <div>{this.props.state.global.id}</div>;
    }
}

const TextViewConnect = store.connect(TextView);
store.addModel(Global);

test('@states', () => {
    render(store.start(<TextViewConnect/>))
    expect(screen.queryByText('100')).not.toBeNull();
});

