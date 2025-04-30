# General

This is a Web Application built with [Next.js](https://nextjs.org) which uses AWS services like AWS Cognito and AWS DynamoDB.
It's purpose to showcase the Clean Architecture pattern to be a good template or a knowledge reference.

## Getting Started

To have a fully functional application you will need at least AWS Free Tier account to be able to instantiate necessary AWS resources.

### Set Up Infrastructure

Open 'terraform' folder and execute `terraform init` and then `terraform apply` to spin up AWS resources.

### Set Up Application locally

Execute `npm run dev` to have application up and running locally. URL to the UI will be available in the CLI console.

### Check dependencies between modules

To check cross-module dependencies use one of next commands:

```bash
# Report about broken dependencies rules in CLI
npm run lint:deps

# Generate SVG report
npx depcruise --config .dependency-cruiser.js src app di shared public tests --output-type dot --validate | dot -T svg > dependency-graph.svg
```
