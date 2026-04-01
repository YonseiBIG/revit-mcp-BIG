import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeColumnTypeTool(server: McpServer) {
  server.tool(
    "change_column_type",
    "Change the FamilySymbol of existing structural column instances by specifying the target type name.",
    {
      elementIds: z
        .array(z.number())
        .describe("Column element IDs to modify"),
      familySymbolName: z
        .string()
        .describe("Target FamilySymbol name to apply"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_column_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `change column type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
