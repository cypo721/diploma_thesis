using System;
using System.IO;
using Microsoft.Azure.WebJobs;
using Newtonsoft.Json;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WebJobToKC.Models;

namespace WebJobToKc
{
    public class Functions
    {
        private static readonly HttpClient client = new HttpClient();
        // Message structure:
        //{
        //  "notificationType": "Message",
        //  "projectKey": "kc-intergration",
        //  "id": "2c0d953b-7ac4-4acc-8a81-8a935b85c451",
        //  "version": 1,
        //  "sequenceNumber": 1,
        //  "resource": {
        //    "typeId": "product",
        //    "id": "8743efcd-e43b-4431-bb18-6b1aeb19d8ec"
        //  },
        //  "resourceVersion": 1,
        //  "type": "ProductCreated",
        //  "productProjection": {
        //    "id": "8743efcd-e43b-4431-bb18-6b1aeb19d8ec",
        //    "version": 1,
        //    "productType": {
        //      "typeId": "product-type",
        //      "id": "3165127d-dfeb-4a93-8f45-e13376308ab7"
        //    },
        //    "name": {
        //      "en": "IPhone SE"
        //    },
        //    "categories": [],
        //    "categoryOrderHints": {},
        //    "slug": {
        //      "en": "iphone-se"
        //    },
        //    "masterVariant": {
        //      "id": 1,
        //      "prices": [],
        //      "images": [],
        //      "attributes": [],
        //      "assets": []
        //    },
        //    "variants": [],
        //    "searchKeywords": {},
        //    "hasStagedChanges": false,
        //    "published": false,
        //    "createdAt": "2018-04-07T21:10:41.798Z",
        //    "lastModifiedAt": "2018-04-07T21:10:41.798Z"
        //  },
        //  "createdAt": "2018-04-07T21:10:41.798Z",
        //  "lastModifiedAt": "2018-04-07T21:10:41.798Z"
        //}
        /// <summary>        
        ///  This function will get triggered/executed when a new message is written 
        ///  on an Azure Queue called queue.
        ///  Set KenticoCloudApiKey in App.config in AppSettings to run this job
        ///  Used to create product in Kentico Cloud in two language variants (defualt, cs_CZ). 
        ///  Setting external_source_id as ID of product in CommerceTools.
        /// </summary>
        /// <param name="message">Generated message from CommerceTools about creation of product</param>
        /// <param name="log">logger</param>
        public static async Task ProcessQueueMessage([ServiceBusTrigger("posttokc")] CommerceToolsMessage message, TextWriter log)
        {
            log.WriteLine("Message to handle: " + message);
            //JObject o = JObject.Parse(message);
            //string id = (string)o.SelectToken("$.productProjection.id");
            //string name = (string)o.SelectToken("$.productProjection.name.en");
            //string typeId = (string)o.SelectToken("$.productProjection.productType.id");
            //string operation = (string)o.SelectToken("$.type");
            
            if (message.Type.Equals("ProductCreated"))
            {
                string token = await GetCommerceToolsAuthToken();

                // get product type name from commercetools
                string type = await getProductTypeName(message.ProductProjection.ProdcutType.Id , token, log);
                CreateItemInKenticoCloudModel createBody = new CreateItemInKenticoCloudModel();
                createBody.Name = message.ProductProjection.Name.En;
                createBody.Type = new CreateItemType();
                createBody.Type.Codename = type;

                //body of request which creates item in Kentico Cloud
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ConfigurationManager.AppSettings["KenticoCloudApiKey"]);
                client.DefaultRequestHeaders.Accept.
                    Add(new MediaTypeWithQualityHeaderValue("application/json"));

                string itemId = "";
                using (HttpResponseMessage response = await client.PostAsync("https://manage.kenticocloud.com/projects/" +
                     ConfigurationManager.AppSettings["KenticoProjectId"] + "/items", new StringContent(JObject.FromObject(createBody).ToString())))

                using (HttpContent content = response.Content)
                {
                    string data = await content.ReadAsStringAsync();
                    JObject o = JObject.Parse(data);
                    itemId = (string)o.SelectToken("$.id");
                }

                //body of request which creates language version of item in Kentico Cloud
                CreateLanguageVariant variant = new CreateLanguageVariant();
                variant.Elements = new Elements();
                variant.Elements.ExternalSourceId = message.ProductProjection.Id;
                log.WriteLine("New product with id: " + message.ProductProjection.ProdcutType.Id + ",name: " + message.ProductProjection.Name.En + ",type: " + type);

                bool success = await CreateLanguageVariant(JObject.FromObject(variant).ToString(), "en-US", itemId, log) ;
                if (!success)
                {
                    log.WriteLine("Problem in creation of item with en-US language created.");
                }
                success = await CreateLanguageVariant(JObject.FromObject(variant).ToString(), "cs-CZ", itemId, log);
                if (!success)
                {
                    log.WriteLine("Problem in creation of item with cs-CZ language created.");
                }
            }
            else
            {
                log.WriteLine("Product already created in Kentico Cloud");
            }
        }

        /// <summary>
        /// Method that creates language verion of item in Kentico Cloud. 
        /// </summary>
        /// <param name="body">body of request</param>
        /// <param name="languageCodename">codename of language that is created</param>
        /// <param name="id">id of item in Kentico Cloud</param>
        /// <param name="log">logger</param>
        /// <returns>value if request was successful</returns>
        private static async Task<bool> CreateLanguageVariant(string body, string languageCodename, string id, TextWriter log)
        {
            string itemId = "";
            using (HttpResponseMessage response = await client.PutAsync("https://manage.kenticocloud.com/projects/"+
                                                     ConfigurationManager.AppSettings["KenticoProjectId"] + "/items/" + id +
                                                "/variants/codename/" + languageCodename
                                                , new StringContent(body)))
            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                itemId = (string)o.SelectToken("$.item.id");
                if (response.IsSuccessStatusCode)
                {
                    log.WriteLine("Created item variant with ID: " + itemId + ", in language with codename:" + languageCodename);
                }
                return response.IsSuccessStatusCode;
            }        

        }

        private static async Task<string> getProductTypeName(string id, string token, TextWriter log)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            using (HttpResponseMessage response = await client.GetAsync("https://api.sphere.io/"+ ConfigurationManager.AppSettings["CommerceToolsProjectId"] +"/product-types/" + id))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                string type = (string)o.SelectToken("$.name");
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                type = type.Replace(" ", "_");
                log.WriteLine("Type: " + type);
                return type.ToLower();
            }
        }

        private static async Task<String> GetCommerceToolsAuthToken()
        {
            string clientId = ConfigurationManager.AppSettings["EcommerceClientId"];
            string clientSecret = ConfigurationManager.AppSettings["EcommerceClientSecret"];
            string authUri = "https://@auth.sphere.io/oauth/token";

            var dict = new Dictionary<string, string>();
            dict.Add("grant_type", "client_credentials");
            dict.Add("scope", "manage_project:kentico-cloud-integration-63");
            var req = new HttpRequestMessage(HttpMethod.Post, authUri) { Content = new FormUrlEncodedContent(dict) };

            var byteArray = Encoding.ASCII.GetBytes(clientId + ":" + clientSecret);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            string token = "";
            using (HttpResponseMessage response = await client.SendAsync(req))

            using (HttpContent content = response.Content)
            {
                var data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                token = (string)o.SelectToken("$.access_token");
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                return token;
            }
        }


    }
}
