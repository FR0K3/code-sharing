import z from "zod";

export const snippetSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  theme: z.string()
});

export const createSnippetSchema = snippetSchema.omit({ id: true });

export type Snippet = z.infer<typeof snippetSchema>;
export type CreateSnippet = z.infer<typeof createSnippetSchema>;