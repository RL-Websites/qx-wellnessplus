import react from "@vitejs/plugin-react";
import * as path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression()],
  build: {
    chunkSizeWarningLimit: 1000,
    // sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          // Check where the file came from
          if (assetInfo.name && assetInfo.name.includes("dml/")) {
            return "dml/[name].[hash].[ext]";
          }
          return "assets/[name].[hash].[ext]";
        },
        manualChunks(id) {
          if (id.includes("node-modules")) {
            return "vendor";
          }
          // if (id.includes("src/common/components/clinic")) {
          //   return "common-clinic";
          // }
          // if (id.includes("src/common/components/patient")) {
          //   return "common-patient";
          // }
          // if (id.includes("src/common/components/prescribe-patient")) {
          //   return "common-prescribe-patient";
          // }
          // if (id.includes("src/common/components/pharmacy")) {
          //   return "common-pharmacy";
          // }
          // if (id.includes("src/common/components")) {
          //   return "common-components";
          // }
          // if (id.includes("src/pages/admin-app/clinic-module")) {
          //   return "admin-clinic-module";
          // }
          // if (id.includes("src/pages/admin-app/client-module")) {
          //   return "admin-client-module";
          // }
          // if (id.includes("src/pages/admin-app/spa-module")) {
          //   return "admin-spa-module";
          // }
          // if (id.includes("src/pages/admin-app/clients")) {
          //   return "admin-clients";
          // }
          // if (id.includes("src/pages/admin-app/doctors")) {
          //   return "admin-doctors";
          // }
          // if (id.includes("src/pages/admin-app/enrollment")) {
          //   return "admin-enrollment";
          // }
          // if (id.includes("src/pages/admin-app/patient-requests")) {
          //   return "admin-patient-requests";
          // }
          // if (id.includes("src/pages/admin-app/patients")) {
          //   return "admin-patients";
          // }
          // if (id.includes("src/pages/admin-app/prescribed-patients")) {
          //   return "admin-prescribed-patients";
          // }
          // if (id.includes("src/pages/admin-app/prescriptions")) {
          //   return "admin-prescriptions";
          // }
          // if (id.includes("src/pages/admin-app/settings")) {
          //   return "admin-settings";
          // }
          // if (id.includes("src/pages/admin-app/users")) {
          //   return "admin-users";
          // }
          if (id.includes("src/pages/admin-app")) {
            return "admin-app";
          }
          // if (id.includes("src/pages/clinic-app")) {
          //   return "clinic-app";
          // }
          // if (id.includes("src/pages/clinical-spa-app")) {
          //   return "clinical-spa-app";
          // }
          //
          // if (id.includes("src/pages/doctor-app/patient-requests")) {
          //   return "doctor-patient-requests";
          // }
          // if (id.includes("src/pages/doctor-app/patients")) {
          //   return "doctor-patients";
          // }
          // if (id.includes("src/pages/doctor-app/prescribed-patients")) {
          //   return "doctor-prescribed-patients";
          // }
          // if (id.includes("src/pages/doctor-app/prescriptions")) {
          //   return "doctor-prescriptions";
          // }
          // if (id.includes("src/pages/doctor-app/settings")) {
          //   return "doctor-settings";
          // }
          // if (id.includes("src/pages/doctor-app/video-chat")) {
          //   return "doctor-video-chat";
          // }
          // if (id.includes("src/pages/doctor-app")) {
          //   return "doctor-app";
          // }

          // if (id.includes("src/pages/medical-spa-app")) {
          //   return "medical-spa-app";
          // }
          // if (id.includes("src/pages/medical-spa-app")) {
          //   return "medical-spa-app";
          // }
          // if (id.includes("src/pages/physician-app")) {
          //   return "physician-app";
          // }
          // if (id.includes("src/pages/prescriber-app")) {
          //   return "prescriber-app";
          // }
          // if (id.includes("src/pages/spa-prescriber-app")) {
          //   return "spa-prescriber-app";
          // }
          if (id.includes("src/pages/auth")) {
            return "auth";
          }
          // if (id.includes("src/pages/clinic-registration")) {
          //   return "clinic-registration";
          // }
          // if (id.includes("src/pages/clinical-spa-registration")) {
          //   return "clinical-spa-registration";
          // }
        },
      },
    },
  },
  server: {
    host: true,
    port: 2550,
    strictPort: true,
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
