/**
 * Fungsi utilitas untuk ekspor riwayat estimasi sprint.
 * Mendukung format Clipboard Markdown (untuk Jira/Linear/Notion) dan CSV.
 */

export function formatHistoryAsMarkdown(history) {
  if (!history || history.length === 0) return '';

  const header = '| No | Tiket / Cerita | Story Point | Status | Waktu |\n|---|---|---|---|---|';
  const rows = history.map((item, index) => {
    const point = item.average !== null ? item.average : 'N/A';
    const status = item.isConsensus ? 'Sepakat' : 'Beragam';
    return `| ${index + 1} | ${item.topic} | ${point} | ${status} | ${item.timestamp} |`;
  });

  return `${header}\n${rows.join('\n')}`;
}

export function downloadHistoryAsCsv(history) {
  if (!history || history.length === 0) return;

  const headers = ['No', 'Tiket / Cerita', 'Story Point', 'Status Konsensus', 'Waktu'];
  const rows = history.map((item, index) => [
    index + 1,
    `"${item.topic.replace(/"/g, '""')}"`,
    item.average !== null ? item.average : 'N/A',
    item.isConsensus ? 'Sepakat' : 'Beragam',
    item.timestamp,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `estimasi-sprint-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
