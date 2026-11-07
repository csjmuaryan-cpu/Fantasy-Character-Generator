import { Character } from '../types/character';
import { formatCharacterMarkdown } from './characterGenerator';

/**
 * Saves a character card file directly to Google Drive
 * Downloads the character sheet locally and directs the user to Google Drive for cloud storage
 */
export function saveCharacterToGoogleDrive(char: Character): { filename: string } {
  const content = formatCharacterMarkdown(char);
  const safeName =
    char.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'character';
  const filename = `${safeName}_lvl${char.level}_${char.class.toLowerCase()}_card.md`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  // Open Google Drive in new tab so user can upload/drag-drop to their Drive
  const driveUrl = 'https://drive.google.com/drive/u/0/my-drive';
  window.open(driveUrl, '_blank', 'noopener,noreferrer');

  return { filename };
}

/**
 * Saves entire character deck compendium to Google Drive
 */
export function saveDeckToGoogleDrive(deck: Character[]): { filename: string; count: number } {
  const deckMarkdown = `# RealmForge — Adventurer Deck Compendium
Total Characters in Deck: ${deck.length}
Exported: ${new Date().toLocaleString()}

${'='.repeat(60)}

${deck.map((c, i) => `## Card #${i + 1}: ${c.name}, ${c.title}\n${formatCharacterMarkdown(c)}`).join('\n\n' + '-'.repeat(50) + '\n\n')}
`;

  const filename = `realmforge_my_deck_${Date.now()}.md`;
  const blob = new Blob([deckMarkdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  // Open Google Drive
  const driveUrl = 'https://drive.google.com/drive/u/0/my-drive';
  window.open(driveUrl, '_blank', 'noopener,noreferrer');

  return { filename, count: deck.length };
}
