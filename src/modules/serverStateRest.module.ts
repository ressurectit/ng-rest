import {NgModule} from '@angular/core';
import {ServerTransferState} from "../serverState/serverTransferState.service";

/**
 * ServerStateRest module 
 */
@NgModule(
{
    imports: [],
    providers: [ServerTransferState]
})
export class ServerStateRestModule
{
}