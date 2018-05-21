using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationToEC.Models
{
    public class Token
    {
        [JsonProperty("token")]
        public string AuthToken { get; set; }
    }
}