import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const CORS: CorsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  credentials: false,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};
