using Newtonsoft.Json.Linq;
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
    public class AuthController : ApiController
    {
        private static readonly HttpClient client = new HttpClient();
        /// <summary>
        /// Used to get authentication token for CommerceTools API.
        /// </summary>
        /// <returns>actual value of auth token</returns>
        public async Task<HttpResponseMessage> GetAuthToken()
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

            Token token = new Token();
            using (HttpResponseMessage response = await client.SendAsync(req))

            using (HttpContent content = response.Content)
            {
                var data = await content.ReadAsStringAsync();
                JObject o = JObject.Parse(data);
                token.AuthToken = (string)o.SelectToken("$.access_token");
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(response.ReasonPhrase);
                }
                HttpResponseMessage msg = new HttpResponseMessage();
                msg.Headers.Add("Access-Control-Allow-Origin", "*");
                msg.Content = new StringContent(JObject.FromObject(token).ToString(), Encoding.UTF8, "application/json");
                return msg;
               // return JObject.FromObject(token);
            }
        }
    }
}
