import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/ui/Tabs";
import { PLAY_MODES } from "@/data/mockData";
import { SpeedRun } from "@/components/gaming/SpeedRun";
import { Hardcore } from "@/components/gaming/Hardcore";
import { TypeAttack } from "@/components/gaming/TypeAttack";
import { Race } from "@/components/gaming/Race";

export function Play() {
  const [mode, setMode] = useState(PLAY_MODES[0].id);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
      <div className="mb-8">
        <p className="mb-2 font-mono text-sm text-accent">Play</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Turn typing into competition.
        </h1>
      </div>

      <Tabs
        className="mb-8"
        options={PLAY_MODES.map((m) => ({ value: m.id, label: m.name }))}
        value={mode}
        onChange={setMode}
      />

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {mode === "speed-run" && <SpeedRun />}
        {mode === "hardcore" && <Hardcore />}
        {mode === "type-attack" && <TypeAttack />}
        {mode === "race" && <Race />}
      </motion.div>
    </div>
  );
}
