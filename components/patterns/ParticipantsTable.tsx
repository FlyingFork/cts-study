'use client';

import type { Participant } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';

export default function ParticipantsTable({ participants }: { participants: Participant[] }) {
  const { lang } = useLang();

  return (
    <div className="overflow-x-auto rounded-md bg-light-bg dark:bg-dark-bg">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="text-xs uppercase text-light-muted dark:text-dark-muted">
          <tr>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Example</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={`${participant.role}-${participant.example}`} className="border-t border-light-border/70 dark:border-dark-border/70">
              <td className="px-4 py-3 font-mono text-light-accent dark:text-dark-accent">{participant.role}</td>
              <td className="px-4 py-3 text-light-muted dark:text-dark-muted">{participant.description[lang]}</td>
              <td className="px-4 py-3 font-mono text-xs">{participant.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
