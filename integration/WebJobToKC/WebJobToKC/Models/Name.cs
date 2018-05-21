using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class Name
    {
        [JsonProperty("en")]
        public string En { get; set; }
    }
}
