using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

namespace WebJobToKc
{
    // To learn more about Microsoft Azure WebJobs SDK, please see https://go.microsoft.com/fwlink/?LinkID=320976
    class Program
    {
        // Please set the following connection strings in app.config for this WebJob to run:
        // AzureWebJobsDashboard and AzureWebJobsStorage
        static void Main()
        {
            var config = new JobHostConfiguration();

            if (config.IsDevelopment)
            {
                config.UseDevelopmentSettings();
            }
            // Set this immediately so that it is used by all requests.
            ServicePointManager.DefaultConnectionLimit = Int32.MaxValue;
            config.Queues.MaxPollingInterval = TimeSpan.FromSeconds(15);
            var host = new JobHost(config);
            //The following code ensures that the WebJob will be running continuously
            host.RunAndBlock();
            //var host = new JobHost();
            //host.CallAsync(typeof(Program).GetMethod("CreateQueueMessage"), new { value = "Hello world!" });
        }

        //[NoAutomaticTrigger]
        //public static void CreateQueueMessage(
        //    TextWriter logger,
        //    string value,
        //    [Queue("posttokc")] out string message)
        //{
        //    message = value;
        //    logger.WriteLine("creating queue message: ", message);
        //}

    }
}
