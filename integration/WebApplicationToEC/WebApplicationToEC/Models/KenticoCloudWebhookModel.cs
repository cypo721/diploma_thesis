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

    public class Data
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("taxonomies")]
        public Taxonomy[] Taxonomies { get; set; }
    }

    /// <summary>
    /// Informations about item which was changed
    /// </summary>
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