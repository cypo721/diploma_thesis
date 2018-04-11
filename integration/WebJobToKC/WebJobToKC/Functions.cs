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

namespace WebJobToKc
{
    public class Functions
    {
        private static readonly HttpClient client = new HttpClient();
        // This function will get triggered/executed when a new message is written 
        // on an Azure Queue called queue.
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
        public static void ProcessQueueMessage([QueueTrigger("posttokc")] string message, TextWriter log)
        {

            log.WriteLine(message);
            JObject o = JObject.Parse(message);
            string id = (string)o.SelectToken("$.productProjection.id");
            string name = (string)o.SelectToken("$.productProjection.name.en");
            string typeId = (string)o.SelectToken("$.productProjection.productType.id");
            string type = "";
            switch (typeId)
            {
                case ("3165127d-dfeb-4a93-8f45-e13376308ab7"):
                    type = "mobile_phone";
                    break;
                case ("c883f44d-c568-4f5d-997b-9a29991952ae"):
                    type = "notebook";
                    break;
                case ("e7ac8750-244f-4c88-8670-f5326e952413"):
                    type = "tablet";
                    break;

            }

            log.WriteLine(id + " " + name + " " + type);

            string body = "{ " +
                                "\"name\": \"" + name + "\"," +
                                "\"type\": { " +
                                            "\"codename\": \"" + type + "\"" +
                                "}," +
                                "\"external_id\": \"" + id + "\"" +
                            "}";
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + System.Configuration.ConfigurationManager.ConnectionStrings["KenticoCloudApiKey"].ConnectionString);
            client.DefaultRequestHeaders.Accept.
                Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = client.PostAsync("https://manage.kenticocloud.com/projects/19eca161-c9c6-00ac-6bc5-822ae7351b73/items", new StringContent(body));
        }

    }
}
