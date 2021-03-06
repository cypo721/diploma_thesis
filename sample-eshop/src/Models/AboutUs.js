import {  ContentItem } from 'kentico-cloud-delivery-typescript-sdk/_bundles';
import {  resolveContentLink } from '../Utilities/ContentLinks';

export class AboutUs extends ContentItem {
    constructor(){
        super({
            propertyResolver: ((fieldName) => {                
                if (fieldName === 'url_pattern'){
                    return 'urlPattern';
                }
            }),
            linkResolver: (link) => resolveContentLink(link)
        })    
    }
    
}