import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerGetRoomsByNameTool(server: McpServer) {
  server.tool(
    "get_rooms_by_name",
    "Get rooms by their names. Returns matching room elements with Id, Name, and properties.",
    {
      roomNames: z
        .array(z.string())
        .describe("List of room names to search for"),
    },
    async (args, extra) => {
      const params = {
        roomNames: args.roomNames,
      };

      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("get_rooms_by_name", params);
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
              text: `get rooms by name failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
