module.exports = {
  apps: [
    {
      name: "vvsu-api",
      cwd: "./artifacts/api-server",
      script: "node",
      args: "--enable-source-maps ./dist/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
      restart_delay: 3000,
      max_restarts: 5,
    },
    {
      name: "vvsu-frontend",
      cwd: "./artifacts/vvsu-tourism",
      script: "npx",
      args: "serve dist -p 8888 -s",
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 3000,
      max_restarts: 5,
    },
  ],
};
