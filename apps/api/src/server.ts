import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer } from "node:http";

import { router } from "./index";

/** Default port for the oRPC HTTP server */
const DEFAULT_PORT = 3001;
const RPC_PREFIX = "/rpc";
const SERVER_HOST = "127.0.0.1";

const port = Number(process.env.PORT ?? DEFAULT_PORT);

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [new CORSPlugin()],
});

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: { headers: req.headers },
    prefix: RPC_PREFIX,
  });

  if (!result.matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
});

server.listen(port, SERVER_HOST, () =>
  console.log(`oRPC server listening on http://${SERVER_HOST}:${port}${RPC_PREFIX}`),
);
