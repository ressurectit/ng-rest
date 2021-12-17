import {isPresent} from '@jscrpt/common';

/**
 * Options for AvroAdapterInterceptor
 */
export class AvroAdapterInterceptorOptions
{
    //######################### public properties #########################
    
    /**
     * Indication whether this interceptor is disabled
     */
    public disabled: boolean = false;
    
    /**
     * Name of header used for passing fingerprint of schema
     */
    public fingerprintHeaderName: string;

    /**
     * Name of header used for passing name of type
     */
    public typeHeaderName: string;

    /**
     * Value passed to custom Accept header and Content-Type header
     */
    public customAcceptContentTypeHeader: string;

    //######################### constructor #########################
    
    
    /**
     * Creates instance of HttpErrorInterceptorOptions
     * @param disabled - Indication whether this interceptor is disabled
     * @param fingerprintHeaderName - Name of header used for passing fingerprint of schema
     * @param typeHeaderName - Name of header used for passing name of type
     * @param customAcceptContentTypeHeader - Value passed to custom Accept header and Content-Type header
     */
    constructor(disabled?: boolean, fingerprintHeaderName?: string, typeHeaderName?: string, customAcceptContentTypeHeader?: string)
    {
        if(isPresent(disabled))
        {
            this.disabled = disabled;
        }
        
        if(isPresent(fingerprintHeaderName))
        {
            this.fingerprintHeaderName = fingerprintHeaderName;
        }

        if(isPresent(typeHeaderName))
        {
            this.typeHeaderName = typeHeaderName;
        }

        if(isPresent(customAcceptContentTypeHeader))
        {
            this.customAcceptContentTypeHeader = customAcceptContentTypeHeader;
        }
    }
}