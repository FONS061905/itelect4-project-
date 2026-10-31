// ===== GT5: a NEW file =====================================================
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiItemHelp } from "../models";
import { askAi } from "../api/ai";
import { aiHelperSchema } from "../schemas/aiHelperSchema";
import type { AiHelperFormValues } from "../schemas/aiHelperSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// One entry for every value readiness can have. Add a fourth value to the
// reply and this object stops compiling until it has a colour for it.
const READINESS_STYLE: Record<AiItemHelp["readiness"], string> = {
  "ready": "bg-green-100 text-green-800",
  "almost": "bg-yellow-100 text-yellow-800",
  "not-yet": "bg-red-100 text-red-800",
};

function ItemHelperPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiHelperFormValues>({
    resolver: zodResolver(aiHelperSchema),
    // No mode: "onBlur". The default checks on submit, then on each keystroke,
    // so the error message is gone before the button is pressed and the
    // button does not move under the cursor.
    defaultValues: { prompt: "" },
  });

  // A mutation: it runs when the button is pressed, never on page load, and
  // each press spends one request from the quota.
  const help = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: AiHelperFormValues): void => {
    help.mutate(values.prompt);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">AI Item Helper</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Describe the item you lost or found, and get help writing a clear report before you post it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="prompt" className="text-foreground">Item description</Label>
          <textarea
            id="prompt"
            rows={6}
            {...register("prompt")}
            aria-invalid={errors.prompt ? true : undefined}
            placeholder="What it is, its colour and features, where and when..."
            className="rounded-lg border border-input bg-background p-2.5 text-sm text-foreground"
          />
          {errors.prompt && (
            <p className="text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        <Button type="submit" disabled={help.isPending} className="justify-self-start">
          {help.isPending ? "Checking..." : "Get help with my report"}
        </Button>
      </form>

      {/* The API's own sentence: the rate limit, the quota, or a refusal --
          never Google's raw error text. */}
      {help.isError && (
        <p className="mt-4 text-sm text-red-700">{help.error.message}</p>
      )}

      {help.data && (
        <div className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-sm font-semibold ${READINESS_STYLE[help.data.readiness]}`}>
              {help.data.readiness}
            </span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {help.data.category}
            </span>
          </div>

          <p className="text-gray-900 dark:text-white">{help.data.summary}</p>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Search tags</h3>
            <ul className="flex flex-wrap gap-2 pt-1 text-sm text-gray-700 dark:text-gray-300">
              {help.data.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-gray-300 px-2 py-0.5 dark:border-gray-600">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Before you post</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {help.data.improvements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemHelperPage;
