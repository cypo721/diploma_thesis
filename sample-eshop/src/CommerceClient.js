import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

var settings = require('./settings.json');

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: 'https://auth.commercetools.com',
    projectKey: 'kentico-cloud-integration-63',
    credentials: {
        clientId: settings.commerceToolsClientId,
        clientSecret: settings.commerceToolsClientSecret,
    },
    fetch
});

const httpMiddleware = createHttpMiddleware({
    host: 'https://api.commercetools.com',
});

const CommerceClient = createClient({
    middlewares: [authMiddleware, httpMiddleware],
});

export default CommerceClient
