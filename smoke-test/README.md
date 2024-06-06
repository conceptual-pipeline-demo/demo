## Back ground
This is the smoke test for demo api

## Tech stack
- node 20
- cypress

### How to run
1. Please go to `smoke-test` folder, make sure you installed node 20 first
```shell
npm install(install the cypress dependency) 
npx cypress run --config baseUrl=http://localhost:9090(change this to your base url)
```