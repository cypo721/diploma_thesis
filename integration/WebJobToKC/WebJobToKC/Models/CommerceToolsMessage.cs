using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
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
    public class CommerceToolsMessage
    {
        [JsonProperty("notificationType")]
        public string NotificationType { get; set; }

        [JsonProperty("projectKey")]
        public string ProjectKey { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("version")]
        public long version { get; set; }

        [JsonProperty("resource")]
        public Resource Resource { get; set; }

        [JsonProperty("sequenceNumber")]
        public long SequenceNumber { get; set; }

        [JsonProperty("resourceVersion")]
        public long ResourceVerion { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("productProjection")]
        public ProductProjection ProductProjection { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("LastModifiedAt")]
        public DateTime LastModifiedAt { get; set; }
    }
}
