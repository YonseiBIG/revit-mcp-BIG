import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerGetAvailableMaterialsTool(server: McpServer) {
  server.tool(
    "get_available_materials",
    "Get all available materials in the current Revit project. Returns material names sorted alphabetically.",
    {
      nameFilter: z
        .string()
        .optional()
        .describe("Optional partial name filter (case-insensitive)"),
    },
    async (args, extra) => {
      const params = {
        nameFilter: args.nameFilter || "",
      };

      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand(
            "get_available_materials",
            params
          );
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
              text: `get available materials failed: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
