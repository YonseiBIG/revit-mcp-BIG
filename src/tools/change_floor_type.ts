import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeFloorTypeTool(server: McpServer) {
  server.tool(
    "change_floor_type",
    "Change the FloorType of existing floor instances by specifying the target type name.",
    {
      elementIds: z
        .array(z.number())
        .describe("Floor element IDs to modify"),
      floorTypeName: z
        .string()
        .describe("Target FloorType name to apply"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_floor_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `change floor type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
