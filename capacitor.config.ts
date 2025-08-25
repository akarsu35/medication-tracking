import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.medicinetracking",
  appName: "Medicine Tracking",
  webDir: "out",
  server: {
    androidScheme: "https"
  }
};

export default config;

