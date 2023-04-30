import { command, parallel, scripts, sequential } from "scriptful";

const next = {
  build: "next build",
  start: "next start",
  dev: "next dev",
  lint: "next lint",
};

const { build, start } = next;

export default scripts({
  build,
  start,
  test: sequential([
    build,
    parallel([
      start,
      command({
        run: "vitest run",
        delay: 5_000, // give next a second to start up
      }),
      command({
        // @ts-ignore we are in node land chill
        run: () => process.exit(0),
        delay: 10_000, // give the tests 10 seconds to run
      }),
    ]),
  ]),
  dev: parallel([
    next.dev,
    command({
      run: "vitest watch",
      delay: 2_000, // give next a second to start up
    }),
  ]),
});
