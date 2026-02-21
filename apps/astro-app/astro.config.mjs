import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import path from "path";

const firebaseAuthBase = path.resolve(
  import.meta.dirname,
  "../../packages/firebase-auth/src"
);

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        "firebase-auth/client/react": path.resolve(
          firebaseAuthBase,
          "client/react.ts"
        ),
        "firebase-auth/client": path.resolve(
          firebaseAuthBase,
          "client/index.ts"
        ),
        // Resolve package1 from source in development for instant updates
        package1:
          process.env.NODE_ENV === "development"
            ? path.resolve(import.meta.dirname, "../../packages/package1/src/index.ts")
            : "package1",
      },
    },
  },
});
