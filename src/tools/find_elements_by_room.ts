import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerFindElementsByRoomTool(server: McpServer) {
  server.tool(
    "find_elements_by_room",
    "Find elements associated with specific rooms. Uses boundary geometry to determine wall/floor association with rooms.",
    {
      roomNames: z
        .array(z.string())
        .describe("List of room names to search"),
      category: z
        .enum(["wall", "floor"])
        .describe("Element category to filter (wall or floor)"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("find_elements_by_room", args);
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
              text: `find elements by room failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
