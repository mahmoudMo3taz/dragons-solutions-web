// PM2 process file: keeps the site running on the VPS and restarts it after crashes or reboots.
//   pm2 start ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      name: "dragons-solutions",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010 -H 127.0.0.1",
      cwd: __dirname,
      env: { NODE_ENV: "production" },
      max_memory_restart: "400M",
    },
  ],
};
