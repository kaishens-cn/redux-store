import {states, namespaces, Models} from '../src';

@namespaces('global')
export class Global extends Models {
    @states()
    id: string = '100';
}
