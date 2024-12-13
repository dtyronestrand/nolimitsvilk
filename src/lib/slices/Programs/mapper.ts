import type {Client, Content, SliceMapper} from '@prismicio/client';
import type {ComponentProps} from 'svelte'; 
import Programs from './index.svelte';

type Context = {client: Client<Content.AllDocumentTypes>};

const mapper: SliceMapper<Content.ProgramsSlice, ComponentProps<Programs>,Context> = async ({slice, context}) =>{
    const {client} = context;

    const programs = await client.getAllByType('program');
    return {slice, programs}

};
export default mapper;