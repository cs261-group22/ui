## About
This readme is written with the intention of the reader having a baseline understanding of modern web application development.
The [Vue.js](https://vuejs.org/) documentation is a good starting place if this is not the case.

An overview of the application:
* FeedBank UI is a standard *Nuxt / Vue.js* application written in *TypeScript* and styled with *Tailwind CSS*
* It communicates with the FeedBank API through HTTP requests and websockets.
* Setup should therefore be routine for those familiar with *Vue.js/Nuxt*.

## Development prerequisites (Docker Compose)
The `docker-compose` configuration in the API repository has a predefined `ui` service, which will automatically:
* Install dependencies
* Set correct environment variables
* Serve the application at `localhost`

This requires this repository to be symlinked into the root of the API repository as `ui`.
Please see the `README.md` in the API repository for more information.

## Development prerequisites (Local)
While `docker-compose` is strongly advised, local development can be setup as follows:
* Ensure `node.js` and `yarn` package manager are installed locally.
* Copy `.env.example` to `.env`.
* Configure the environment variables in `.env` as follows:

  | Variable Name                | Description                  |
  |-----------------------------|------------------------------|
  |   `BASE_URL`                    | URL of the API service       |
  | `NUXT_ENV_API_ROUTE`          | Prefix for API routes        |
  | `NUXT_HOST`                   | Host to serve the UI from    |
  | `NUXT_PORT`                   | Port to serve the API from   |
  | `NUXT_ENV_RECAPTCHA_SITE_KEY` | Google Recaptcha V2 site key |
  | `NUXT_ENV_WS_HOST`            | Host of the websocket server |
  | `NUXT_ENV_WS_PORT`            | Port of the websocket server |      
* Install dependencies with `yarn install`
* Serve the application locally with `yarn dev`                                                   

## Package Commands
The following commands are exposed by the `package.json` file:

```bash
# serve locally in development mode with hot reload
$ yarn dev

# check code for formatting issues
$ yarn lint

# compile code to static javascript
$ yarn generate
```

## CI/CD
The UI service is configured to deploy to Google App Engine automatically, in the following stages:
* `lint` - check the codebase for coding standards issues with `eslint`
* `deploy` - compiles the codebase to static JavaScript and deploys to App Engine.
  
Configuration for the Github Actions pipeline can be found in `github/workflows/ci.yml`.
Deployment configuration for App Engine can be found in `.appengine/app.yaml`

## Application Structure
The directory structure for the application is the same as a standard *Nuxt* installation, with the following files/folders being most notable:
* `components/` - Vue components that can be reused throughout the site
* `layouts/` - Vue components that contain parent layouts for multiple pages
* `mixins/` - Logic that can be reused between Vue components
* `pages/` - Vue components for individual pages, with the file/folder structure matching the URLs accessible by users
* `store/` - Vuex global state management logic
* `types/` - TypeScript definitions for models
* `nuxt.config.js` - Build configuration for the application
* `tailwind.config.js` - Global styling configuration for TailWind.

## Further Reading

For a detailed explanation on how things work, refer to the [Nuxt.js docs](https://nuxtjs.org).
