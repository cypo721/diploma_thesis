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

    public class PublishController : ApiController
    {
        private static readonly HttpClient client = new HttpClient();

        // POST api/publish
        public async Task<HttpStatusCode> Post([FromBody]KenticoCloudWebhookModel item)
        {
            System.Diagnostics.Trace.TraceInformation("POST METHOD");
            if (item.Message.Operation.Equals("publish")) {
   
                string publishUri = "https://api.sphere.io/"+ System.Configuration.ConfigurationManager.AppSettings["CommerceToolsProjectId"] + "/products/";
                var kcProjectId = System.Configuration.ConfigurationManager.AppSettings["KenticoProjectId"];

                for (int i = 0; i < item.Data.Items.Length; i++)
                {
                    var codeName = item.Data.Items[i].Codename;
                    var language = item.Data.Items[i].Language;
                    System.Diagnostics.Trace.TraceInformation("Item codename: " + item.Data.Items[i].Codename + ",lang:" + language);

                    client.DefaultRequestHeaders.Accept.
                         Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    // get published item from Kentico Cloud
                    try
                    {
                        string productId = await GetPublishedItemFromKenticoCloud(kcProjectId, codeName, language);

                        //authentication to CommerceTools
                        string token = await GetCommerceToolsAuthToken();

                        string version = await GetVersionOfCommerceToolsProduct(token, productId, publishUri);

                        //publish product in CommerceTools
                        return await PublishInCommerceTools(version, productId, token);
                    }
                    catch(HttpRequestException ex)
                    {
                        System.Diagnostics.Trace.TraceInformation(ex.Message);
                        return HttpStatusCode.BadRequest;
                    }
                }
            }
            System.Diagnostics.Trace.TraceInformation("Not publish operation.");
            return HttpStatusCode.OK;
        }

        private async Task<HttpStatusCode> PublishInCommerceTools(string version, string productId, string token)
        {
            string body = "{ " +
                 "\"version\": " + version + "," +
                 "\"actions\": [{ " +
                             "\"action\": \"publish\"" +
                 "}]" +
             "}";

            string publishUri = "https://api.sphere.io/" + System.Configuration.ConfigurationManager.AppSettings["CommerceToolsProjectId"] + "/products/";
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Accept.
                Add(new MediaTypeWithQualityHeaderValue("application/json"));
            using (HttpResponseMessage response = await client.PostAsync(publishUri + productId, new StringContent(body)))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject obj = JObject.Parse(data);
                System.Diagnostics.Trace.TraceInformation("New version of product in CommerceTools: " + (string)obj.SelectToken("$.version"));
                return response.StatusCode;
            }
        }

        private async Task<string> GetPublishedItemFromKenticoCloud(string kcProjectId, string codeName, string lang)
        {
            var productId = "";
            string deliveryUri = "https://deliver.kenticocloud.com/" + kcProjectId + "/items/" + codeName + "?language=" + lang;

            using (HttpResponseMessage response = await client.GetAsync(deliveryUri))
            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                productId = (string)o.SelectToken("$.item.elements.external_source_id.value");
                System.Diagnostics.Trace.TraceInformation("Product ID: " + productId);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                return productId;
            }
        }

        private async Task<String> GetCommerceToolsAuthToken()
        {
            string clientId = System.Configuration.ConfigurationManager.AppSettings["EcommerceClientId"];
            string clientSecret = System.Configuration.ConfigurationManager.AppSettings["EcommerceClientSecret"];
            string authUri = "https://@auth.sphere.io/oauth/token";

            var dict = new Dictionary<string, string>();
            dict.Add("grant_type", "client_credentials");
            dict.Add("scope", "manage_project:kentico-cloud-integration-63");
            var req = new HttpRequestMessage(HttpMethod.Post, authUri) { Content = new FormUrlEncodedContent(dict) };

            var byteArray = Encoding.ASCII.GetBytes(clientId + ":" + clientSecret);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            string token = "";
            using (HttpResponseMessage response = await client.SendAsync(req))

            using (HttpContent content = response.Content)
            {
                var data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                token = (string)o.SelectToken("$.access_token");
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                return token;
            }
        }

        private async Task<String> GetVersionOfCommerceToolsProduct(string token, string productId, string publishUri)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            using (HttpResponseMessage response = await client.GetAsync(publishUri + productId))

            using (HttpContent content = response.Content)
            {
                string data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                string version = (string)o.SelectToken("$.version");
                System.Diagnostics.Trace.TraceInformation("Actual version: " + version);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                return version;
            }

        }
    }
}
