import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerGetLevelsByNameTool(server: McpServer) {
  server.tool(
    "get_levels_by_name",
    "Get levels by their names. Returns matching level elements with Id, Name, and elevation.",
    {
      levelNames: z
        .array(z.string())
        .describe("List of level names to search for"),
    },
    async (args, extra) => {
      const params = {
        levelNames: args.levelNames,
      };

      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("get_levels_by_name", params);
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
              text: `get levels by name failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
