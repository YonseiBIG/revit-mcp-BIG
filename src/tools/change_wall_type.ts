import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeWallTypeTool(server: McpServer) {
  server.tool(
    "change_wall_type",
    "Change the WallType of existing wall instances by specifying the target wall type name.",
    {
      elementIds: z
        .array(z.number())
        .describe("Wall element IDs to modify"),
      wallTypeName: z
        .string()
        .describe("Target WallType name to apply"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_wall_type", args);
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
              text: `change wall type failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
