interface AppConfig {
  App: {
    baseUrl: string;
    ossUrl: string;
  };
  Auth: {
    audience: string;
    domain: string;
    clientId: string;
  };
  gRPC: {
    hostname: string;
  };
}

export const app_config: AppConfig = {
  App: {
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    ossUrl: import.meta.env.VITE_APP_OSS_URL
  },
  Auth: {
    audience: import.meta.env.VITE_AUTH_AUDIENCE,
    domain: import.meta.env.VITE_AUTH_DOMAIN,
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID
  },
  gRPC: {
    hostname: import.meta.env.VITE_GRPC_HOSTNAME
  }
};
