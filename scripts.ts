import { scripts, sequential, command, variants } from "scriptful";

const build = "tsc";

export default scripts({
  build,
  dev: "tsc --watch",
  typecheck: "tsc --noEmit",
  release: sequential([build, "changeset publish"]),
  "new-version": "changeset",
  test: variants({
    ci: sequential([
      command({
        run: "pnpm install",
        cwd: "test-app",
      }),
      command({
        run: "pnpm test",
        cwd: "test-app",
      }),
    ]),
    run: command({
      run: "pnpm test",
      cwd: "test-app",
    }),
    dev: command({
      run: "pnpm dev",
      cwd: "test-app",
    }),
  }),
});
