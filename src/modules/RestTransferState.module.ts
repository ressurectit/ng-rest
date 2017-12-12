import {NgModule, ModuleWithProviders} from '@angular/core';
import {RestTransferStateService} from '../transferState/restTransferState.service';

/**
 * Transfer state module for RESTClient
 */
@NgModule(
{
    imports: [],
    providers: []
})
export class RestTransferStateModule
{
    //######################### public methods #########################
    
    /**
     * Returns module with RestTransferStateModule provider that is used for app root module
     */
    public static forRoot(): ModuleWithProviders 
    {
        return {
            ngModule: RestTransferStateModule,
            providers: 
            [
                RestTransferStateService
            ]
        };
    }
}