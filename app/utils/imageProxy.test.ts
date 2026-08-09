import assert from "node:assert/strict";
import test from "node:test";

import { toProxiedBangumiImageUrl } from "./imageProxy";

test("proxies SteamGridDB CDN images through the same origin", () => {
  assert.equal(
    toProxiedBangumiImageUrl("https://cdn2.steamgriddb.com/grid/cover.png"),
    "/api/proxy?url=https%3A%2F%2Fcdn2.steamgriddb.com%2Fgrid%2Fcover.png",
  );
});

test("leaves unrelated image URLs unchanged", () => {
  assert.equal(
    toProxiedBangumiImageUrl("https://example.com/cover.png"),
    "https://example.com/cover.png",
  );
});
