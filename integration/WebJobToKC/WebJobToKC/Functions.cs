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
        public static async Task ProcessQueueMessage([ServiceBusTrigger("posttokc")] string message, TextWriter log)
        {
            log.WriteLine("Message to handle: " + message);
            JObject o = JObject.Parse(message);
            string id = (string)o.SelectToken("$.productProjection.id");
            string name = (string)o.SelectToken("$.productProjection.name.en");
            string typeId = (string)o.SelectToken("$.productProjection.productType.id");
            string operation = (string)o.SelectToken("$.type");
            string type = "";
            
            if (operation.Equals("ProductCreated"))
            { 
                // getting type of product in CommerceTools
                //switch (typeId)
                //{
                //    case ("3165127d-dfeb-4a93-8f45-e13376308ab7"):
                //        type = "mobile_phone";
                //        break;
                //    case ("c883f44d-c568-4f5d-997b-9a29991952ae"):
                //        type = "notebook";
                //        break;
                //    case ("e7ac8750-244f-4c88-8670-f5326e952413"):
                //        type = "tablet";
                //        break;
                //}
                switch (typeId)
                {
                    case ("ec73aefd-a746-48e6-b967-880a49f2a634"):
                        type = "mobile_phone";
                        break;
                    case ("9177eac7-0c40-4ace-b084-fb26d6ffa3a8"):
                        type = "notebook";
                        break;
                    case ("a357a12d-49ae-4180-9c3f-d0b671c0e0e0"):
                        type = "tablet";
                        break;
                }
                log.WriteLine("New product with id: " + id + ",name: " + name + ",type: " + type);

                //body of request which creates item in Kentico Cloud
                string body = "{ " +
                                    "\"name\": \"" + name + "\"," +
                                    "\"type\": { " +
                                                "\"codename\": \"" + type + "\"" +
                                    "}" +
                                "}";

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", System.Configuration.ConfigurationManager.AppSettings["KenticoCloudApiKey"]);
                client.DefaultRequestHeaders.Accept.
                    Add(new MediaTypeWithQualityHeaderValue("application/json"));

                string itemId = "";
                using (HttpResponseMessage response = await client.PostAsync("https://manage.kenticocloud.com/projects/19eca161-c9c6-00ac-6bc5-822ae7351b73/items", new StringContent(body)))

                using (HttpContent content = response.Content)
                {
                    string data = await content.ReadAsStringAsync();
                    o = JObject.Parse(data);
                    itemId = (string)o.SelectToken("$.id");
                }

                //body of request which creates language version of item in Kentico Cloud
                body = "{ " +
                        "\"elements\": { " +
                              "\"external_source_id\": \"" + id + "\"" +
                        "}" +
                    "}";

                bool success = await CreateLanguageVariant(body, "default", itemId, log) ;
                if (!success)
                {
                    log.WriteLine("Problem in creation of item with default language created.");
                }
                success = await CreateLanguageVariant(body, "cs_CZ", itemId, log);
                if (!success)
                {
                    log.WriteLine("Problem in creation of item with cs_CZ language created.");
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
            using (HttpResponseMessage response = await client.PutAsync("https://manage.kenticocloud.com/projects/19eca161-c9c6-00ac-6bc5-822ae7351b73/items/" + id +
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

    }
}
