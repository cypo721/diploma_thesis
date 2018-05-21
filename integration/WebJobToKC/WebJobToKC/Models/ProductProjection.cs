using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebJobToKC.Models
{
    public class ProductProjection
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("version")]
        public long Version { get; set; }

        [JsonProperty("productType")]
        public ProductType ProdcutType { get; set; }

        [JsonProperty("name")]
        public Name Name { get; set; }

        [JsonProperty("slug")]
        public Slug Slug { get; set; }

        [JsonProperty("hasStagedChanges")]
        public bool HasStagedChanges { get; set; }

        [JsonProperty("published")]
        public bool Published { get; set; }

        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("LastModifiedAt")]
        public DateTime LastModifiedAt { get; set; }
    }
}
