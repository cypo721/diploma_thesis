using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class Elements
    {
        [JsonProperty("external_source_id")]
        public string ExternalSourceId { get; set; }
    }
}
