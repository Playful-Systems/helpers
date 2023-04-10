import { parallel, scripts, sequential } from "scriptful"

export default scripts({
  build: "tsc",
  dev: "tsc --watch",
  typecheck: "tsc --noEmit",
  release: sequential([
    parallel([
      "pnpm run typecheck",
      "pnpm run build"
    ]),
    "changeset publish"
  ]),
  "new-version": "changeset",
})
