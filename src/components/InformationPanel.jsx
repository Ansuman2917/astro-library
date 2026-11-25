import { useEffect, useMemo, useRef, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { getPanelData } from '../data/panelContent';
import { requestPointerLock } from '../utils/pointerLock';
import { audioEngine } from '../audio/AudioEngine';

const TYPE_LABEL = {
  book: 'ENTRY',
  section: 'TRACK',
  area: 'FOCUS TABLE',
};

export default function InformationPanel() {
  const activePanel = useUIStore((state) => state.activePanel);
  const openPanel = useUIStore((state) => state.openPanel);
  const closePanel = useUIStore((state) => state.closePanel);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef();
  const timer = useRef();

  const data = useMemo(() => getPanelData(activePanel), [activePanel]);

  useEffect(() => {
    setClosing(false);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  }, [activePanel?.id]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = () => {
    if (closing) return;
    audioEngine.panelClose();
    requestPointerLock();
    setClosing(true);
    timer.current = window.setTimeout(() => {
      closePanel();
      setClosing(false);
    }, 220);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  if (!data) return null;

  return (
    <aside
      className={`info-panel glass${closing ? ' info-panel--closing' : ''}`}
      style={{ '--accent': data.color }}
      role="dialog"
      aria-modal="false"
      aria-label={data.title}
    >
      <div className="info-panel__rail" aria-hidden="true" />

      <header className="info-panel__head">
        <div className="info-panel__heading">
          <p className="eyebrow">
            <span />
            {data.eyebrow}
          </p>
          <h2>{data.title}</h2>
          <p className="info-panel__subtitle">{data.subtitle}</p>
        </div>
        <button type="button" className="icon-close" onClick={close} aria-label="Close panel">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <div className="info-panel__scroll" ref={scrollRef}>
        {data.quote && (
          <blockquote className="info-panel__quote">
            <span aria-hidden="true">“</span>
            {data.quote.replace(/[“”]/g, '').trim()}
          </blockquote>
        )}

        <p className="info-panel__description">{data.description}</p>

        <div className="info-panel__meta">
          {data.meta.map((item) => (
            <div key={item.label} className="info-panel__meta-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        {data.tags.length > 0 && (
          <div className="info-panel__tags">
            {data.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {data.links.length > 0 && (
          <section className="info-panel__section">
            <h3>Connect</h3>
            <div className="info-panel__links">
              {data.links.map((link) => (
                <a
                  key={link.label}
                  className="info-panel__link"
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  onClick={() => audioEngine.click()}
                >
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        )}

        {data.highlights.length > 0 && (
          <section className="info-panel__section">
            <h3>Highlights</h3>
            <ul className="info-panel__highlights">
              {data.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {data.books.length > 0 && (
          <section className="info-panel__section">
            <div className="info-panel__section-head">
              <h3>{data.booksLabel}</h3>
              <span>{TYPE_LABEL[data.kind] ?? 'ENTRY'}</span>
            </div>
            <div className="info-panel__books">
              {data.books.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  className="book-card"
                  onClick={() => openPanel({ type: 'book', id: book.id })}
                >
                  <i style={{ background: book.color }} />
                  <span className="book-card__copy">
                    <strong>{book.title}</strong>
                    <span>
                      {book.author} · {book.year}
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </section>
        )}

        {data.sectionId && data.kind !== 'section' && (
          <button
            type="button"
            className="info-panel__section-link"
            onClick={() => openPanel({ type: 'section', id: data.sectionId })}
          >
            View {data.sectionName}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        )}

        <footer className="info-panel__footer">
          <span>WASD stays active while this entry is open.</span>
          <button type="button" className="link-button" onClick={close}>
            Return to view <kbd>ESC</kbd>
          </button>
        </footer>
      </div>
    </aside>
  );
}
