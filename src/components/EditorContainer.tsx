import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MonacoEditor from '@monaco-editor/react';
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Dropdown, { type Option } from "./Dropdown";
import shareIcon from "../assets/icons/Share.svg"
import initialHtml from '../template.html?raw';
import ShareLink from "./ShareLink";
import { createSnippet, getSnippet } from "../services/snippets.service";
import type { CreateSnippet } from "../schemas/snippets.schema";

export default function EditorContainer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(initialHtml);
  const [language, setLanguage] = useState("html");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saved, setSaved] = useState<{ id: string; code: string; language: string; theme: string } | null>(null);

  const isDirty =
    !saved ||
    saved.code !== code ||
    saved.language !== language ||
    saved.theme !== theme;

  // ** Options for the language and theme dropdowns
  const languageOptions: Option[] = [
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
  ];

  const themeOptions: Option[] = [
    { value: "light", label: "Light" },
    { value: "vs-dark", label: "VS Dark" },
  ];

  // ** Function to generate a unique shareable link
  const handleShare = async () => {
    if (loading) return;
    setLoading(true);

    const data: CreateSnippet = {
      code,
      language,
      theme
    };

    try {
      const snippet = await createSnippet(data);
      setSaved(snippet);

      const url = new URL(`/${snippet.id}`, window.location.origin).toString();

      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.success("Snippet created! Copy the link from the address bar.");
      }

      navigate(`/${snippet.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // ** Fetch code snippet if an ID is present in the URL
  useEffect(() => {
    if (!id) return;

    if (saved?.id === id) return;

    const controller = new AbortController();

    const fetchSnippet = async () => {
      try {
        setFetchLoading(true);

        const snippet = await getSnippet(id);

        setCode(snippet.code);
        setLanguage(snippet.language);
        setTheme(snippet.theme);

        setSaved(snippet);
      } catch (error) {
        if (controller.signal.aborted) return;

        toast.error(error instanceof Error ? error.message : "Failed to fetch snippet.");

        navigate("/", { replace: true });

      } finally {
        if (!controller.signal.aborted) setFetchLoading(false);
      }
    }

    fetchSnippet();

    return () => controller.abort();
  }, [id])

  return (
    <>
      <div className={`w-11/12 xl:w-2/3 mx-auto mt-10 flex flex-col items-center justify-center shadow-2xl rounded-2xl ${theme === "vs-dark" ? "bg-dark-vs" : "bg-white"}`}>
        {
          fetchLoading ?
            <div className="w-full h-183.75 pt-4 flex items-center justify-center">
              <Spinner />
            </div>
            :
            <MonacoEditor
              className="w-full h-full pt-4"
              height="600px"
              width="100%"
              loading={<Spinner />}
              defaultLanguage="html"
              theme={theme}
              value={code}
              language={language}
              onChange={val => setCode(val || "")}
            />
        }

        <div className="relative z-20 w-full flex items-end justify-between p-5">
          <div className="flex items-center gap-3">
            <Dropdown
              options={languageOptions}
              value={language}
              onChange={setLanguage}
            />
            <Dropdown
              options={themeOptions}
              value={theme}
              onChange={setTheme}
            />
          </div>
          <div className="flex items-center gap-3">
            {
              (id && !fetchLoading) && (
                <ShareLink
                  url={id}
                  theme={theme}
                />
              )
            }

            <button
              className={`${theme === "vs-dark" ? "bg-dark-btn hover:bg-dark-btn/90" : "bg-sky hover:bg-sky/90"} ${isDirty ? "cursor-pointer" : "cursor-not-allowed"} text-white flex gap-2 px-7 py-2 rounded-3xl transition-colors text-lg`}
              onClick={handleShare}
              type="button"
              disabled={!isDirty || loading}
            >
              <img src={shareIcon} alt="Share" />
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

