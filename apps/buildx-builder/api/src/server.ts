import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer } from "node:http";

import { router } from "./index";

/** Default port for the oRPC HTTP server */
const DEFAULT_PORT = 3001;

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
  });

  if (!result.matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
});

server.listen(DEFAULT_PORT, "127.0.0.1", () =>
  console.log(`oRPC server listening on http://127.0.0.1:${DEFAULT_PORT}`),
);
