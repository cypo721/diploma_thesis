using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationToEC.Models
{
    public class Data
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }

        [JsonProperty("taxonomies")]
        public Taxonomy[] Taxonomies { get; set; }
    }
}