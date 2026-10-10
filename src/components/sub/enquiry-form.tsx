"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

const EMAIL = "razvizaid259@gmail.com";

// No backend: the form composes an email in the visitor's own mail app,
// so nothing is stored on this site.
export function EnquiryForm({ services }: { services: { id: string; title: string }[] }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const service = services.find((s) => s.id === get("service"))?.title ?? "Not sure yet";

    const subject = `Project enquiry: ${service}${get("company") ? ` (${get("company")})` : ""}`;
    const fields: [string, string][] = [
      ["Name", get("name")],
      ["Company", get("company")],
      ["Looking for", service],
      ["Timeline", get("timeline")],
      ["Budget", get("budget")],
    ];
    const body = [
      ...fields.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
      "",
      get("details"),
    ].join("\n");

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm text-gray-300">
        Your name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-gray-300">
        Company <span className="text-gray-400">(optional)</span>
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm text-gray-300 sm:col-span-2">
        What do you need?
        <select name="service" defaultValue="" className={field}>
          <option value="" className="bg-[#0b0620]">Not sure yet</option>
          {services.map((s) => (
            <option key={s.id} value={s.id} className="bg-[#0b0620]">
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-300">
        Timeline <span className="text-gray-400">(optional)</span>
        <input name="timeline" placeholder="e.g. live by March" className={field} />
      </label>
      <label className="text-sm text-gray-300">
        Budget <span className="text-gray-400">(optional)</span>
        <input name="budget" placeholder="a range is fine" className={field} />
      </label>
      <label className="text-sm text-gray-300 sm:col-span-2">
        Tell me about the project
        <textarea
          name="details"
          required
          rows={5}
          placeholder="What you want built, who it's for, and anything you've already got (designs, an existing app, examples you like)."
          className={field}
        />
      </label>
      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
        >
          <Mail className="size-4" /> Write the email
        </button>
        <p className="text-xs text-gray-400">Opens your email app with this filled in. Nothing is stored on this site.</p>
      </div>
      {sent && (
        <p className="text-sm text-gray-300 sm:col-span-2" role="status">
          If your email app didn&apos;t open, write to{" "}
          <a href={`mailto:${EMAIL}`} className="text-purple-300 underline">{EMAIL}</a>.
        </p>
      )}
    </form>
  );
}
