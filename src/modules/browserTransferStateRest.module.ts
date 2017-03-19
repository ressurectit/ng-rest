import {NgModule, ModuleWithProviders, FactoryProvider} from '@angular/core';
import {TransferStateService} from "../transferState/transferState.service";
import {TRANSFER_STATE_NAME} from "../transferState/transferState.service";

/**
 * Creates transfer state service for browser
 */
export function getTransferState(): TransferStateService 
{
    const transferState = new TransferStateService();
    transferState.initialize(window[TRANSFER_STATE_NAME] || {});

    return transferState;
}

/**
 * Transfer state module for browser side
 */
@NgModule(
{
    imports: [],
    providers: []
})
export class BrowserTransferStateRestModule
{
    //######################### public methods #########################
    
    /**
     * Returns module with BrowserTransferState provider that is used for app root module
     */
    public static forRoot(): ModuleWithProviders 
    {
        return {
            ngModule: BrowserTransferStateRestModule,
            providers: 
            [
                <FactoryProvider>
                {
                    provide: TransferStateService,
                    useFactory: getTransferState
                }
            ]
        };
    }
}