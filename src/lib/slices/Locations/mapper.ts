import type {Client, Content, SliceMapper} from '@prismicio/client';
import type {ComponentProps} from 'svelte'; 
import Locations from './index.svelte';

type Context = {client: Client<Content.AllDocumentTypes>};

const mapper: SliceMapper<Content.LocationsSlice, ComponentProps<Locations>,Context> = async ({slice, context}) =>{
    const {client} = context;

    const locations = await client.getAllByType('location');
    return {slice, locations}

};
export default mapper;