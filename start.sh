#!/bin/bash

set -e
npx drizzle-kit generate
npx drizzle-kit migrate
npm run start:prod