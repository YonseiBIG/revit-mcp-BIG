import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerFindHostedElementsTool(server: McpServer) {
  server.tool(
    "find_hosted_elements",
    "Find elements hosted on specific elements (e.g., doors/windows hosted on walls).",
    {
      hostElementIds: z
        .array(z.number())
        .describe("List of host element IDs (e.g., wall IDs)"),
      category: z
        .enum(["door", "window"])
        .describe("Category of hosted elements to find"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("find_hosted_elements", args);
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `find hosted elements failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
