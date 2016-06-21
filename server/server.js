"use strict";
const path = require("path");
const koa = require("koa");
const koaRouter = require("koa-router");
const koaStatic = require("koa-static");
const koaNoCache = require("koa-no-cache");
const requisition = require("requisition");
const httpError = require("http-errors");
const config = require("../config.json");
const privateConfig = require("../config-private.json");

const ROOT = path.resolve(__dirname, "../www");

const ONE_YEAR = 31536000000;

const app = koa();
const router = koaRouter();

router.get(config.gitHub.redirectRoute, function* () {
  /* eslint-disable no-invalid-this */ // seems to be a bug?

  handleGitHubOAuthError(this.request.query);

  /* eslint-disable camelcase */
  const response = yield requisition.post("https://github.com/login/oauth/access_token")
    .type("application/x-www-form-urlencoded")
    .set("Accept", "application/json")
    .send({
      grant_type: "authorization_code",
      client_id: config.gitHub.clientId,
      redirect_uri: config.gitHub.redirectURL,
      client_secret: privateConfig.gitHub.clientSecret,
      code: this.request.query.code
    });
  /* eslint-enable camelcase */

  const responseJSON = yield response.json();
  handleGitHubOAuthError(responseJSON);

  this.cookies.set(config.gitHub.cookie, responseJSON.access_token, {
    expires: new Date(Date.now() + ONE_YEAR),
    httpOnly: false
  });

  this.body = `<!DOCTYPE html><meta charset="utf-8">
               <script>window.opener.${config.gitHub.callback}(); window.close();</script>`;
});

function handleGitHubOAuthError(response) {
  if (response.error) {
    throw httpError(response.error_description, { code: response.error });
  }
}

app.use(koaNoCache({ paths: ["/service-worker-bundle.js"] }))
   .use(koaStatic(ROOT))
   .use(router.routes())
   .use(router.allowedMethods())
   .listen(config.port);
