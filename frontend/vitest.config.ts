import react from '@vitejs/plugin-react'
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        setupFiles: "./src/__tests__/setupTests",
        environment: "jsdom",
        globals: true,
    },
});
