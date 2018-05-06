using Newtonsoft.Json.Linq;
using RestSharp;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using WebApplicationToEC.Models;

namespace WebApplicationToEC.Controllers
{
    /*
     * Used to publish product in CommerceTools, when product is published in Kentico Cloud 
     */
    public class PublishController : ApiController
    {
        private static readonly HttpClient client = new HttpClient();

        // POST api/publish
        [SwaggerOperation("Create")]
        [SwaggerResponse(HttpStatusCode.Created)]
        public async Task Post([FromBody]KenticoCloudWebhookModel item)
        {
            string clientId = System.Configuration.ConfigurationManager.AppSettings["EcommerceClientId"];
            string clientSecret = System.Configuration.ConfigurationManager.AppSettings["EcommerceClientSecret"];
            string authUri = "https://@auth.sphere.io/oauth/token";
            string publishUri = "https://api.sphere.io/kc-intergration/products/";

            client.DefaultRequestHeaders.Accept.
                Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var codeName = item.Data.Items[0].Codename;
            System.Diagnostics.Trace.TraceInformation("CD " + item.Data.Items[0].Codename);
            var kcProjectId = "19eca161-c9c6-00ac-6bc5-822ae7351b73";

            // get published item from Kentico Cloud
            var productId = "";
            string deliveryUri = "https://deliver.kenticocloud.com/" + kcProjectId + "/items/" + codeName;
            using (HttpResponseMessage response = await client.GetAsync(deliveryUri))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                productId = (string)o.SelectToken("$.item.system.name");

            }

            System.Diagnostics.Trace.TraceInformation("PID " + productId);
            //authentication to CommerceTools
            var dict = new Dictionary<string, string>();
            dict.Add("grant_type", "client_credentials");
            dict.Add("scope", "manage_project:kc-intergration");
            var req = new HttpRequestMessage(HttpMethod.Post, authUri) { Content = new FormUrlEncodedContent(dict) };

            var byteArray = Encoding.ASCII.GetBytes(clientId+":"+clientSecret);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            string token = "";
            using (HttpResponseMessage response = await client.SendAsync(req))

            using (HttpContent content = response.Content)
            {
                var data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                token = (string)o.SelectToken("$.access_token");
            }

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            string version = "";

            using (HttpResponseMessage response = await client.GetAsync(publishUri + productId))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                version = (string)o.SelectToken("$.version");

            }
            System.Diagnostics.Trace.TraceInformation("vers " + version);

            //publish product in CommerceTools
            string body = "{ " +
                             "\"version\": " + version + "," +
                             "\"actions\": [{ " +
                                         "\"action\": \"publish\"" +
                             "}]" +
                         "}";

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Accept.
                Add(new MediaTypeWithQualityHeaderValue("application/json"));

            using (HttpResponseMessage response = await client.PostAsync(publishUri + productId, new StringContent(body)))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject obj = JObject.Parse(data);
                System.Console.WriteLine((string)obj.SelectToken("$.version"));
            }

            //var result = await client.PostAsync(publishUri + product, new StringContent(body));
        }
    }
}
