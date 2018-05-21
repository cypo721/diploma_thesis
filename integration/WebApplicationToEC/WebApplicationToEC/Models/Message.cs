using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationToEC.Models
{
    /// <summary>
    /// Message with information about operation of item in Kentico Cloud
    /// </summary>
    public class Message
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("operation")]
        public string Operation { get; set; }

        [JsonProperty("api_name")]
        public string ApiName { get; set; }

        [JsonProperty("project_id")]
        public Guid ProjectId { get; set; }
    }
}