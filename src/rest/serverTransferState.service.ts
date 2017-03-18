import {Injectable, Optional, RendererFactory2, ViewEncapsulation} from '@angular/core';
import {TransferStateService} from './transferState.service';
import {PlatformState} from '@angular/platform-server';

/**
 * Name of variable stored in html for transfering state
 */
export const TRANSFER_STATE_NAME = 'NG_TRANSFER_STATE';

@Injectable()
export class ServerTransferState extends TransferStateService
{
    //######################### constructors #########################
    constructor(private state: PlatformState, 
                private rendererFactory: RendererFactory2)
    {
        super();
    }

    //######################### public methods #########################
    /**
     * Inject the State into the bottom of the <head>
     */
    public inject()
    {
        try
        {
            const document: any = this.state.getDocument();
            const transferStateString = JSON.stringify(this.toJson());

            const renderer = this.rendererFactory.createRenderer(document,
            {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const head = document.children[0].children[0];

            if (head.name !== 'head')
            {
                throw new Error('Please have <head> as the first element in your document');
            }

            const script = renderer.createElement('script');
            renderer.setValue(script, `window['${TRANSFER_STATE_NAME}'] = ${transferStateString}`);
            renderer.appendChild(head, script);
        }
        catch (e)
        {
            console.error(e);
        }
    }
}