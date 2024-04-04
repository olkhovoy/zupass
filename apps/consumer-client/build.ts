import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import * as dotenv from "dotenv";
import { build, BuildOptions, context } from "esbuild";
import fs from "fs";
import http from "node:http";

dotenv.config();

console.log("building consumer-client");

const consumerClientAppOpts: BuildOptions = {
  sourcemap: true,
  bundle: true,
  define: {
    "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
    "process.env.CONSUMER_SERVER_URL": `'${process.env.CONSUMER_SERVER_URL}'`,
    "process.env.ZUPASS_CLIENT_URL_CONSUMER": `'${process.env.ZUPASS_CLIENT_URL_CONSUMER}'`,
    "process.env.ZUPASS_SERVER_URL_CONSUMER": `'${process.env.ZUPASS_SERVER_URL_CONSUMER}'`
  },
  entryPoints: ["src/main.tsx"],
  plugins: [
    NodeModulesPolyfillPlugin(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true
    })
  ],
  loader: {
    ".svg": "dataurl"
  },
  outdir: "public/js",
  metafile: true
};

run(process.argv[2])
  .then(() => console.log("Built consumer client artifacts"))
  .catch((err) => console.error(err));

async function run(command: string): Promise<void> {
  switch (command) {
    case "build":
      const clientRes = await build({ ...consumerClientAppOpts, minify: true });
      console.error("Built client");

      // Bundle size data for use with https://esbuild.github.io/analyze/
      fs.writeFileSync(
        `${consumerClientAppOpts.outdir}/bundle-size.json`,
        JSON.stringify(clientRes.metafile)
      );

      break;
    case "dev":
      const ctx = await context(consumerClientAppOpts);
      await ctx.watch();

      const options = {
        host: "0.0.0.0",
        // port: 3001,
        servedir: "public"
      };

      const { host, port } = await ctx.serve(options);

      // Then start a proxy server on port 3000
      http
        .createServer((req, res) => {
          const options = {
            hostname: host,
            port: req.url.startsWith("/auth") ? 3003 : port,
            path: req.url,
            method: req.method,
            headers: req.headers
          };

          // Forward each incoming request to esbuild
          const proxyReq = http.request(options, (proxyRes) => {
            // If esbuild returns "not found", send a custom 404 page
            if (proxyRes.statusCode === 404) {
              res.writeHead(404, { "Content-Type": "text/html" });
              res.end("<h1>A custom 404 page</h1>");
              return;
            }

            // Otherwise, forward the response from esbuild to the client
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          });

          // Forward the body of the request to esbuild
          req.pipe(proxyReq, { end: true });
        })
        .listen(3001);

      console.log(`Serving consumer client on http://${host}:${3001}`);
      break;
    default:
      throw new Error(`Unknown command ${command}`);
  }
}
