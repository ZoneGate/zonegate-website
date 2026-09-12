"use client";

/**
 * Operator sign-in.
 *
 * Laid out to match the mobile app's login screen: mark, wordmark, two flat
 * fields and one full-width action, on plain white with nothing else competing
 * for attention.
 *
 * There is no account creation here by design: identities are created on the
 * enrolled roster, and this screen only proves that someone already on it is
 * the one at the keyboard.
 */

import { useState } from "react";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { ApiError, login, type Actor } from "@/lib/api";

export default function LoginScreen({ unreachable, onSignedIn }: {
    unreachable: string | null;
    onSignedIn: (actor: Actor) => void;
}) {
    const [actorId, setActorId] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ready = Boolean(actorId.trim() && password);

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        if (!ready || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            const session = await login(actorId.trim(), password);
            setPassword("");
            onSignedIn(session.actor);
        } catch (caught) {
            setError(
                caught instanceof ApiError
                    ? caught.message
                    : "Sign-in failed. Please try again."
            );
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
            <div className="w-full max-w-xs">
                <div className="flex flex-col items-center">
                    {/* The shield is the artwork; the wordmark is live text, so
                        every letter stays correctly drawn at any size. */}
                    <Image
                        src="/zonegate-shield.png"
                        alt=""
                        width={555}
                        height={689}
                        sizes="88px"
                        priority
                        className="h-auto w-[88px]"
                    />

                    <h1 className="mt-4 text-[32px] font-bold leading-none tracking-tight text-[#145567]">
                        ZoneGate
                    </h1>
                </div>

                {unreachable && (
                    <div role="alert" className="mt-8 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
                        <p className="text-sm font-medium text-[#B91C1C]">Authorization API unavailable</p>
                        <p className="mt-1 font-mono text-[11px] text-[#DC2626]">{unreachable}</p>
                    </div>
                )}

                <form onSubmit={submit} className="mt-10">
                    <fieldset disabled={submitting} className="flex flex-col gap-4 disabled:opacity-60">
                        <legend className="sr-only">Operator credentials</legend>

                        {/* Labels are visually hidden to keep the placeholder-only
                            look, but screen readers still announce each field. */}
                        <label htmlFor="login-actor" className="sr-only">Employee ID</label>
                        <input
                            id="login-actor"
                            value={actorId}
                            onChange={(event) => setActorId(event.target.value)}
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                            maxLength={128}
                            placeholder="Employee ID"
                            className="w-full rounded-lg border border-transparent bg-[#F1F5F9] px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0D9488] focus:bg-white"
                        />

                        <label htmlFor="login-password" className="sr-only">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            maxLength={200}
                            placeholder="Password"
                            className="w-full rounded-lg border border-transparent bg-[#F1F5F9] px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0D9488] focus:bg-white"
                        />
                    </fieldset>

                    {error && (
                        <p role="alert" className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!ready || submitting}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#134E4A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0F3E3B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <LogIn size={17} />
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm leading-relaxed text-[#94A3B8]">
                    Accounts are not created here. If you cannot sign in, ask an
                    operator with console access to enrol you or reset your password.
                </p>
            </div>
        </div>
    );
}
