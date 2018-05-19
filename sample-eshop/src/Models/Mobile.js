import {  ContentItem } from 'kentico-cloud-delivery-typescript-sdk/_bundles';
import {  resolveContentLink } from '../Utilities/ContentLinks';

export class Mobile extends ContentItem {

    constructor(){
        super({
            propertyResolver: ((fieldName) => {

                if (fieldName === 'main_picture'){
                    return 'mainPicture';
                }
                if (fieldName === 'external_source_id'){
                    return 'externalSourceId';
                }

            }),
            linkResolver: (link) => resolveContentLink(link)
        })
    }
}