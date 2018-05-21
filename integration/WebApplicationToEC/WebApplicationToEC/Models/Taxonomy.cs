using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationToEC.Models
{
    public class Taxonomy
    {
        [JsonProperty("codename")]
        public string Codename { get; set; }
    }
}