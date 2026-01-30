export function getPakasirConfig() {
  const project = process.env.PAKASIR_PROJECT_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  
  if (!project || !apiKey) {
    // We don't throw during build, but we should handle it at runtime
    return { project: project || "", apiKey: apiKey || "" };
  }
  
  return { project, apiKey };
}

export const PAKASIR_API_BASE = "https://app.pakasir.com/api";
