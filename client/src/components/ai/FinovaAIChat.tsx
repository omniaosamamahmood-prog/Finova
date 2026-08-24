import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import Button from "../ui/Button";
import { useAIChat } from "../../hooks/useAIChat";
import { getErrorMessage } from "../../utils/errorMessage";
import type { AiChatHistoryItem } from "../../services/ai.service";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTION_KEYS = [
  "analyzeSpending",
  "saveMore",
  "budgetNearLimit",
  "topCategory",
  "goalsProgress",
] as const;

const HISTORY_WINDOW = 8;

function FinovaAIChat() {
  const { t, i18n } = useTranslation();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatMutation = useAIChat();

  const language = i18n.language.startsWith("ar") ? "ar" : "en";

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, chatMutation.isPending, open]);

  const sendMessage = async (raw: string) => {
    const message = raw.trim();
    if (!message || chatMutation.isPending) return;

    setErrorKey(null);
    setInput("");

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message,
    };

    const history: AiChatHistoryItem[] = messages
      .slice(-HISTORY_WINDOW)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await chatMutation.mutateAsync({
        message,
        language,
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      setErrorKey(getErrorMessage(error, "ai.errors.failed"));
      setMessages((prev) => prev.filter((item) => item.id !== userMessage.id));
      setInput(message);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:end-6"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <MessageCircle className="size-5" aria-hidden />
        <span className="hidden sm:inline">{t("ai.open")}</span>
        <span className="sm:hidden">{t("ai.shortTitle")}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-end sm:justify-end sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            aria-label={t("common.close")}
            onClick={() => setOpen(false)}
          />

          <section
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("ai.title")}
            className="relative flex h-[min(100dvh,720px)] w-full max-w-lg flex-col overflow-hidden border border-border bg-bg-elevated shadow-2xl sm:h-[min(85dvh,640px)] sm:rounded-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-muted text-primary">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 text-start">
                  <h2 className="truncate text-base font-semibold text-fg">
                    {t("ai.title")}
                  </h2>
                  <p className="truncate text-xs text-fg-muted">
                    {t("ai.subtitle")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-fg-muted transition hover:bg-surface hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={t("common.close")}
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-fg-muted">
                    <div className="mb-2 flex items-center gap-2 font-medium text-fg">
                      <Bot className="size-4 text-primary" aria-hidden />
                      {t("ai.welcomeTitle")}
                    </div>
                    <p>{t("ai.welcomeBody")}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                      {t("ai.suggestionsLabel")}
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTION_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => void sendMessage(t(`ai.suggestions.${key}`))}
                          className="rounded-xl border border-border bg-bg px-3 py-2.5 text-start text-sm text-fg transition hover:border-primary/40 hover:bg-primary-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {t(`ai.suggestions.${key}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : "border border-border bg-surface text-fg"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-fg-muted">
                    {t("ai.thinking")}
                  </div>
                </div>
              )}
            </div>

            {errorKey && (
              <div
                role="alert"
                className="mx-4 mb-2 rounded-xl border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger"
              >
                {t(errorKey, { defaultValue: errorKey })}
              </div>
            )}

            <form
              className="border-t border-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(input);
              }}
            >
              <div className="flex items-end gap-2">
                <label className="sr-only" htmlFor={`${panelId}-input`}>
                  {t("ai.inputLabel")}
                </label>
                <textarea
                  id={`${panelId}-input`}
                  ref={inputRef}
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder={t("ai.placeholder")}
                  maxLength={1000}
                  className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
                <Button
                  type="submit"
                  className="!w-auto shrink-0 !px-3 !py-2.5"
                  isLoading={chatMutation.isPending}
                  disabled={!input.trim()}
                  aria-label={t("ai.send")}
                >
                  <Send className="size-4" aria-hidden />
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export default FinovaAIChat;
