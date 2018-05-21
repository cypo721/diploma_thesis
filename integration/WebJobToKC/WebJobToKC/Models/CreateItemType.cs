using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class CreateItemType
    {
        [JsonProperty("codename")]
        public string Codename { get; set; }
    }
}