import { books, booksById, librarySections, readingAreasById, sectionsById } from './librarySections';

const booksForSection = (sectionId) => books.filter((book) => book.sectionId === sectionId);

const relatedToBook = (book) =>
  booksForSection(book.sectionId).filter((other) => other.id !== book.id);

const levelLabel = (level) =>
  level === 1 ? 'Level 02 · Experience Gallery' : 'Level 01 · Project Gallery';

export function getPanelData(panel) {
  if (!panel) return null;

  if (panel.type === 'book') {
    const book = booksById[panel.id];
    if (!book) return null;
    const section = sectionsById[book.sectionId];
    return {
      kind: 'book',
      eyebrow: 'PORTFOLIO ENTRY',
      title: book.title,
      subtitle: `${book.author} · ${book.year}`,
      color: book.color,
      description: book.description,
      quote: book.excerpt,
      meta: [
        { label: 'Reference', value: book.callNumber },
        { label: 'Track', value: section?.name ?? 'Unfiled' },
        { label: 'Level', value: levelLabel(book.level) },
        { label: 'Focus', value: book.constellation },
        { label: 'Stack', value: book.pages },
        { label: 'Status', value: 'Portfolio entry' },
      ],
      tags: book.tags,
      highlights: [],
      books: relatedToBook(book),
      booksLabel: 'Related entries',
      links: book.links ?? [],
      sectionId: book.sectionId,
      sectionName: section?.name,
    };
  }

  if (panel.type === 'section') {
    const section = librarySections.find((item) => item.id === panel.id);
    if (!section) return null;
    const sectionBooks = booksForSection(section.id);
    return {
      kind: 'section',
      eyebrow: section.level === 1 ? 'EXPERIENCE & CREDENTIALS' : 'PORTFOLIO TRACK',
      title: section.name,
      subtitle: section.tagline,
      color: section.color,
      description: section.description,
      quote: null,
      meta: [
        { label: 'Level', value: section.level === 1 ? 'Level 02' : 'Level 01' },
        { label: 'Type', value: section.level === 1 ? 'Experience' : 'Project track' },
        {
          label: 'Entries',
          value: sectionBooks.length ? String(sectionBooks.length) : 'Reference point',
        },
        {
          label: 'Location',
          value:
            section.id === 'orrery'
              ? 'Central gallery'
              : section.id === 'entrance'
                ? 'Entrance'
                : `Gallery position ${section.angle}°`,
        },
      ],
      tags: [],
      highlights: section.highlights,
      books: sectionBooks,
      booksLabel: 'Entries in this track',
      links: section.links ?? [],
      sectionId: section.id,
      sectionName: section.name,
    };
  }

  if (panel.type === 'area') {
    const area = readingAreasById[panel.id];
    if (!area) return null;
    const section = sectionsById[area.sectionId];
    return {
      kind: 'area',
      eyebrow: area.eyebrow ?? 'FOCUS TABLE',
      title: area.name,
      subtitle: area.subtitle ?? `${section?.name ?? 'Portfolio'} · Focus table`,
      color: area.color,
      description: area.description,
      quote: null,
      meta: area.meta ?? [
        { label: 'Level', value: 'Level 01 · Project Gallery' },
        { label: 'Format', value: 'Interactive project table' },
        { label: 'Access', value: 'Hover and click to inspect' },
        { label: 'Related track', value: section?.name ?? '—' },
      ],
      tags: [],
      highlights: area.highlights,
      books: area.recommendedBookIds.map((id) => booksById[id]).filter(Boolean),
      booksLabel: area.booksLabel ?? 'Recommended entries',
      links: area.links ?? [],
      sectionId: area.sectionId,
      sectionName: section?.name,
    };
  }

  return null;
}

export function getSectionMarker(section) {
  if (section.id === 'orrery') return { x: 0, z: 0 };
  if (section.id === 'entrance') return { x: 8.8, z: 0 };
  const a = ((section.angle ?? 0) * Math.PI) / 180;
  return { x: Math.cos(a) * 8.25, z: Math.sin(a) * 8.25 };
}
