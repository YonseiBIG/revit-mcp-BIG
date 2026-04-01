import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeWindowTypeTool(server: McpServer) {
  server.tool(
    "change_window_type",
    "Change the FamilySymbol of existing window instances. Preserves original dimensions by creating matching size types in the target family.",
    {
      elementIds: z
        .array(z.number())
        .describe("Window element IDs to modify"),
      familyName: z
        .string()
        .describe("Target Family name to apply (window sizes are preserved)"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_window_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `change window type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
