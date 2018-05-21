using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationToEC.Models
{
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
}