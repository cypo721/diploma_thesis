using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class CreateLanguageVariant
    {
        [JsonProperty("elements")]
        public Elements Elements { get; set; }
    }
}
