#!/bin/bash
npm run build
npx wrangler deploy --config wrangler.toml 