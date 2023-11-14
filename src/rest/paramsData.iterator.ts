import type {ParameterTransformFunc, RESTClient} from './common';
import {KeyIndex, ParametersTransformsObj} from './rest.interface';

/**
 * Data that represents item during iteration of params data
 */
export interface ParamsDataIteratorItem<TData = unknown>
{
    /**
     * Bound Parameter transformation function
     */
    transformFn: ParameterTransformFunc<TData, TData>|undefined|null;

    /**
     * Index of parameter in array of parameters
     */
    index: number;

    /**
     * Value of parameter
     */
    value: TData;

    /**
     * Key/name of parameter
     */
    key: string;
}

/**
 * Iterator for params data
 */
export class ParamsDataIterator
{
    //######################### public properties #########################

    /**
     * Iterator for params data
     */
    public [Symbol.iterator](): Iterator<ParamsDataIteratorItem>
    {
        let x = 0;
        const args = this.args;
        const paramData = this.paramData ?? [];
        const transforms = this.transforms;
        const restClient = this.restClient;

        return {
            next() 
            {
                //skip optional parameters
                while(x < paramData.length && args[paramData[x].parameterIndex] === undefined)
                {
                    x++;
                }

                if (x >= paramData.length)
                {
                    return {
                        done: true,
                        value: undefined
                    };
                }
                
                const param = paramData[x];
                const value = args[param.parameterIndex];
                let transformFn = transforms ? transforms[param.parameterIndex] : null;

                if(transformFn)
                {
                    transformFn = transformFn.bind(restClient);
                }
                
                if (x < paramData.length) 
                {
                    x++;

                    return {
                        value: 
                        {
                            index: param.parameterIndex,
                            key: param.key,
                            value,
                            transformFn,
                        },
                        done: false
                    };
                }
        
                return {
                    value: undefined,
                    done: true 
                };
            }
        };
    }

    //######################### constructor #########################
    constructor(protected paramData: KeyIndex[]|undefined,
                protected transforms: ParametersTransformsObj|undefined,
                protected args: unknown[],
                protected restClient: RESTClient,)
    {
    }
}