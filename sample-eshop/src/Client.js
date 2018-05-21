// kentico cloud
import { DeliveryClient, DeliveryClientConfig, TypeResolver } from 'kentico-cloud-delivery-typescript-sdk/_bundles';
// models
import { AboutUs } from './Models/AboutUs'
import { Home } from './Models/Home'
import { Tablet } from './Models/Tablet'
import { Notebook } from './Models/Notebook'
import { Mobile } from './Models/Mobile'


/*
Create client to communicate with Kentico Cloud API.
 */
const projectId = '19eca161-c9c6-00ac-6bc5-822ae7351b73';
const previewApiKey = "";


// configure type resolvers
let typeResolvers = [
  new TypeResolver('about_us', () => new AboutUs()),
  new TypeResolver('home', () => new Home()),
  new TypeResolver('tablet', () => new Tablet()),
  new TypeResolver('notebook', () => new Notebook()),
  new TypeResolver('mobile_phone', () => new Mobile())
];


function isPreview() {
  return previewApiKey !== "";
}

export default new DeliveryClient(
  new DeliveryClientConfig(projectId, typeResolvers,
    {
      enablePreviewMode: isPreview(),
      previewApiKey: previewApiKey
    }
  )
)