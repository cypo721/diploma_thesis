using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApplicationToEC.Models
{
    /*
     * Model which is sended with webhook call, when product in Kentico Cloud change state.
     */
    public class KenticoCloudWebhookModel
    {
        [JsonProperty("message")]
        public Message Message { get; set; }

        [JsonProperty("data")]
        public Data Data { get; set; }
    }

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

    public class Data
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("taxonomies")]
        public Taxonomy[] Taxonomies { get; set; }
    }

    public class Item
    {
        [JsonProperty("language")]
        public string Language { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("codename")]
        public string Codename { get; set; }
    }

    public class Taxonomy
    {
        [JsonProperty("codename")]
        public string Codename { get; set; }
    }
}