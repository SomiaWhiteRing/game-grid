const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  throw new Error("未找到 .next/standalone。请先执行 next build。");
}

for (const folder of ["public", path.join(".next", "static")]) {
  const source = path.join(root, folder);
  if (!fs.existsSync(source)) continue;
  const destination = path.join(standalone, folder);
  fs.cpSync(source, destination, { recursive: true, force: true });
}
