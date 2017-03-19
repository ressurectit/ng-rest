import {NgModule, ModuleWithProviders, ClassProvider} from '@angular/core';
import {ServerTransferStateService} from "../transferState/serverTransferState.service";
import {TransferStateService} from "../transferState/transferState.service";

/**
 * Transfer state module for server side
 */
@NgModule(
{
    imports: [],
    providers: []
})
export class ServerTransferStateRestModule
{
    //######################### public methods #########################
    
    /**
     * Returns module with ServerTransferState provider that is used for app root module
     */
    public static forRoot(): ModuleWithProviders 
    {
        return {
            ngModule: ServerTransferStateRestModule,
            providers: 
            [
                <ClassProvider>
                { 
                    provide: TransferStateService, 
                    useClass: ServerTransferStateService 
                }
            ]
        };
    }

}