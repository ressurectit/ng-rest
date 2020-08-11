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
     * Name of header used for passing fingerprint
     */
    public fingerprintHeaderName: string;

    /**
     * Name of header used for passing name of type
     */
    public typeHeaderName: string;

    /**
     * Value passed to custom Accept header
     */
    public customAcceptHeader: string;

    //######################### constructor #########################
    
    
    /**
     * Creates instance of HttpErrorInterceptorOptions
     * @param disabled - Indication whether this interceptor is disabled
     * @param fingerprintHeaderName - Name of header used for passing fingerprint
     * @param typeHeaderName - Name of header used for passing name of type
     * @param customAcceptHeader - Value passed to custom Accept header
     */
    constructor(disabled?: boolean, fingerprintHeaderName?: string, typeHeaderName?: string, customAcceptHeader?: string)
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

        if(isPresent(customAcceptHeader))
        {
            this.customAcceptHeader = customAcceptHeader;
        }
    }
}