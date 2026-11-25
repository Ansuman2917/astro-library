import { useMemo } from 'react';
import InteractiveObject from './InteractiveObject';
import {
  BOOK_RADIUS,
  books,
  librarySections,
  polar,
  readingAreas,
} from '../data/librarySections';
import { FLOOR_Y } from '../data/world';

const SECTION_MARKER_RADIUS = 7.55;
const VISIBLE_BOOK_IDS = new Set([
  'accenture-role',
  'udacity-nanodegree',
  'ai-ml-foundations',
  'portfolio-focus',
]);
const VISIBLE_SECTION_ID = 'archives';

const sectionSpot = (section) => {
  if (section.id === 'orrery') {
    return {
      position: [0, 4.7, 0],
      variant: 'orrery',
      markerScale: 1.5,
      proxyRadius: 0.55,
      range: 7.5,
    };
  }
  if (section.id === 'entrance') {
    return {
      position: [8.35, 1.68, 0],
      variant: 'entrance',
      markerScale: 1.05,
      proxyRadius: 0.3,
      range: 3.8,
    };
  }
  if (section.level === 1) {
    return {
      position: polar(section.angle, SECTION_MARKER_RADIUS, 5.6),
      variant: 'section',
      markerScale: 1.15,
      proxyRadius: 0.3,
      range: 4.6,
    };
  }
  return {
    position: polar(section.angle, SECTION_MARKER_RADIUS, 2.35),
    variant: 'section',
    markerScale: 1.15,
    proxyRadius: 0.3,
    range: 4.6,
  };
};

export default function InteractiveSpots() {
  const bookSpots = useMemo(
    () =>
      books
        .filter((book) => VISIBLE_BOOK_IDS.has(book.id))
        .map((book) => {
          const level = book.level ?? 0;
          return {
            book,
            position: polar(book.angle, BOOK_RADIUS, level === 1 ? 5.6 : 1.72),
            level,
          };
        }),
    []
  );

  const sectionSpots = useMemo(
    () =>
      librarySections
        .filter((section) => section.id === VISIBLE_SECTION_ID)
        .map((section) => ({ section, ...sectionSpot(section) })),
    []
  );

  const areaSpots = useMemo(
    () =>
      readingAreas.map((area) => ({
        area,
        position: polar(area.angle, area.radius, FLOOR_Y + 1.4),
      })),
    []
  );

  return (
    <group>
      {bookSpots.map(({ book, position, level }) => (
        <InteractiveObject
          key={book.id}
          id={`book-${book.id}`}
          position={position}
          color={book.color}
          type="book"
          variant="book"
          label={book.title}
          sublabel={`${book.author} · ${book.year}`}
          level={level}
          panel={{ type: 'book', id: book.id }}
          markerScale={0.9}
        />
      ))}

      {sectionSpots.map(({ section, position, variant, markerScale, proxyRadius, range }) => (
        <InteractiveObject
          key={`section-${section.id}`}
          id={`section-${section.id}`}
          position={position}
          color={section.color}
          type="section"
          variant={variant}
          label={section.name}
          sublabel={section.tagline}
          level={section.level ?? 0}
          panel={{ type: 'section', id: section.id }}
          markerScale={markerScale}
          proxyRadius={proxyRadius}
          range={range}
        />
      ))}

      {areaSpots.map(({ area, position }) => (
        <InteractiveObject
          key={`area-${area.id}`}
          id={`area-${area.id}`}
          position={position}
          color={area.color}
          type="area"
          variant="area"
          label={area.name}
          sublabel={area.sublabel ?? 'Focus table'}
          level={0}
          panel={{ type: 'area', id: area.id }}
          markerScale={1.05}
          range={4.2}
        />
      ))}
    </group>
  );
}
