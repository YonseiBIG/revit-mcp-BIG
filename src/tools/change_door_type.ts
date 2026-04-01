import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeDoorTypeTool(server: McpServer) {
  server.tool(
    "change_door_type",
    "Change the FamilySymbol of existing door instances by specifying the target type name.",
    {
      elementIds: z
        .array(z.number())
        .describe("Door element IDs to modify"),
      familySymbolName: z
        .string()
        .describe("Target FamilySymbol name to apply"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_door_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `change door type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
