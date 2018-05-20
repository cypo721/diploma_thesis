import { createClient } from '@commercetools/sdk-client'
import { createAuthMiddlewareWithExistingToken } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

let accessToken;

// Middleware, when you want to use credentials of commerce tools project
// const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
//     host: 'https://auth.commercetools.com',
//     projectKey: 'kentico-cloud-integration-63',
//     credentials: {
//         clientId: "id",
//         clientSecret: "secret",
//     },
//     fetch
// });

let authWithTokenMiddleware = (accessToken) => createAuthMiddlewareWithExistingToken(
    `Bearer ${accessToken}`, {
        force: true,
});


const httpMiddleware = createHttpMiddleware({
    host: 'https://api.commercetools.com',
});

export function setToken(token) {
    accessToken = token;
}

const CommerceClient = (token) =>
    createClient({
        middlewares: [authWithTokenMiddleware(token? token : accessToken), httpMiddleware],
    });

export default CommerceClient
