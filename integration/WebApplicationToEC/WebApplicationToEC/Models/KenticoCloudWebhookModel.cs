using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApplicationToEC.Models
{
    /// <summary>
    /// Model which is send with webhook call, when product in Kentico Cloud change state.
    /// </summary>
    public class KenticoCloudWebhookModel
    {
        [JsonProperty("message")]
        public Message Message { get; set; }

        [JsonProperty("data")]
        public Data Data { get; set; }
    }
}