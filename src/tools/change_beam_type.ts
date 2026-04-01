import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withRevitConnection } from "../utils/ConnectionManager.js";

export function registerChangeBeamTypeTool(server: McpServer) {
  server.tool(
    "change_beam_type",
    "Change the FamilySymbol of existing beam instances by specifying the target type name.",
    {
      elementIds: z
        .array(z.number())
        .describe("Beam element IDs to modify"),
      familySymbolName: z
        .string()
        .describe("Target FamilySymbol name to apply"),
    },
    async (args, extra) => {
      try {
        const response = await withRevitConnection(async (revitClient) => {
          return await revitClient.sendCommand("change_beam_type", args);
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `change beam type failed: ${error instanceof Error ? error.message : String(error)}` }],
        };
      }
    }
  );
}
