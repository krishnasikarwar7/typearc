import { Link } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs } from "@/components/ui/Tabs";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type TypeArcSettings } from "@/lib/settings";
import type { TestDuration } from "@/types";

function BooleanControl({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="inline-flex rounded-md border border-border bg-[#092328] p-1" role="group" aria-label="Setting value"><button type="button" aria-pressed={checked} onClick={() => onChange(true)} className={`rounded-sm px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 ${checked ? "bg-accent text-[#e7f0e8]" : "text-text-muted hover:text-text-primary"}`}>ON</button><button type="button" aria-pressed={!checked} onClick={() => onChange(false)} className={`rounded-sm px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 ${!checked ? "bg-accent-2 text-[#092328]" : "text-text-muted hover:text-text-primary"}`}>OFF</button></div>;
}

export function Settings() {
  const [settings, setSettings] = useState<TypeArcSettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const update = <K extends keyof TypeArcSettings>(key: K, value: TypeArcSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    saveSettings(settings);
    setSaved(true);
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setSaved(false), 1800);
    return () => { if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current); };
  }, [settings]);
  const apply = () => { saveSettings(settings); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  const reset = () => setSettings(DEFAULT_SETTINGS);

  return <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 sm:px-6 sm:pt-32">
    <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent-2"><ArrowLeft size={15} /> Back to typing</Link>
    <div className="mt-7 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-accent-2"><SettingsIcon size={18} /></span><div><p className="font-mono text-xs tracking-[0.16em] text-accent">SETTINGS</p><h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Tune your typing space.</h1><p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">Your preferences are saved locally and applied to every new typing test.</p></div></div>
    <div className="mt-8 space-y-5">
      <SettingsGroup title="Typing"><SettingTabs label="Default duration" description="Used when a new test begins." value={String(settings.defaultDuration)} options={[30, 45, 60, 120].map((value) => ({ value: String(value), label: `${value}s` }))} onChange={(value) => update("defaultDuration", Number(value) as TestDuration)} /><SettingTabs label="Font size" description="Controls the reading size in the typing area." value={settings.fontSize} options={["small", "medium", "large"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))} onChange={(value) => update("fontSize", value as TypeArcSettings["fontSize"])} /><SettingToggle label="Show live timer" description="Keep the countdown visible while typing." checked={settings.showLiveTimer} onChange={(value) => update("showLiveTimer", value)} /><SettingToggle label="Caret" description="Show the current-character cursor." checked={settings.typingCaret} onChange={(value) => update("typingCaret", value)} /></SettingsGroup>
      <SettingsGroup title="Motion"><SettingToggle label="Smooth animations" description="Use transitions and gentle motion throughout TypeArc." checked={settings.smoothAnimations} onChange={(value) => update("smoothAnimations", value)} /></SettingsGroup>
    </div>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={14} /> Reset to defaults</Button><div className="flex items-center gap-3"><span className="text-xs text-accent-2">{saved ? "Saved locally" : ""}</span><Button onClick={apply}>{saved && <Check size={15} />} {saved ? "Saved" : "Save settings"}</Button></div></div>
  </div>;
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) { return <GlassCard elevated className="p-5 sm:p-6"><h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent">{title}</h2><div className="divide-y divide-border">{children}</div></GlassCard>; }
function SettingToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) { return <div className="flex items-center justify-between gap-4 py-3.5"><div><p className="text-sm font-medium text-text-primary">{label}</p><p className="mt-0.5 text-xs text-text-muted">{description}</p></div><BooleanControl checked={checked} onChange={onChange} /></div>; }
function SettingTabs({ label, description, value, options, onChange }: { label: string; description: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) { return <div className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-text-primary">{label}</p><p className="mt-0.5 text-xs text-text-muted">{description}</p></div><Tabs options={options} value={value} onChange={onChange} /></div>; }
