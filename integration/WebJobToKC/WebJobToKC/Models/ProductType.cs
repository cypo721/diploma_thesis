using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class ProductType
    {
        [JsonProperty("typeId")]
        public string TypeId { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
