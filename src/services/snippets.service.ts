import axios, { isAxiosError } from "axios";
import { ZodError } from "zod";
import api from "../lib/axios";
import { snippetSchema, type CreateSnippet } from "../schemas/snippets.schema";
import { ApiError } from "../utils/ApiError";

export const createSnippet = async (formData: CreateSnippet) => {
  try {
    const { data } = await api.post("api/snippets", formData);

    return snippetSchema.parse(data);

  } catch (error) {
    if (error instanceof ZodError)
      throw new ApiError("Invalid response from server");

    if (isAxiosError(error)) {
      const message = error.response?.data?.message;

      throw new ApiError(
        typeof message === "string" ? message : "Snippet could not be created",
        error.response?.status
      );
    }

    throw error;

  }
}

export const getSnippet = async (id: string) => {
  try {
    const { data } = await api.get(`api/snippets/${id}`);

    return snippetSchema.parse(data);

  } catch (error) {
    if (axios.isCancel(error)) throw error;

    if (error instanceof ZodError)
      throw new ApiError("Invalid response from server");

    if (isAxiosError(error)) {
      const message = error.response?.data?.message;

      throw new ApiError(
        typeof message === "string" ? message : "Snippet could not be obtained",
        error.response?.status
      );
    }

    throw error;
  }
}