'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type AnchorHTMLAttributes,
  type CSSProperties,
} from 'react';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

interface PreviewLinkCardContextType {
  href: string;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  content: ReactNode | null;
  setContent: (c: ReactNode | null) => void;
  side: Side;
  sideOffset: number;
  align: Align;
  alignOffset: number;
  setPosition: (p: { side?: Side; sideOffset?: number; align?: Align; alignOffset?: number }) => void;
}

const Ctx = createContext<PreviewLinkCardContextType | null>(null);

function useCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('PreviewLinkCard* components must be used within <PreviewLinkCard>');
  }
  return ctx;
}

/* Styles injectés une seule fois, quel que soit le nombre d'instances */
let stylesInjected = false;
function injectStylesOnce() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-preview-link-card', '');
  style.textContent = `
    .preview-link-card-popover {
      position: absolute;
      z-index: 100;
      animation: plc-fade-in 0.15s ease-out;
      pointer-events: auto;
    }
    .preview-link-card-popover[data-side="bottom"] {
      top: calc(100% + var(--plc-side-offset, 8px));
      left: 50%;
      transform: translateX(-50%);
    }
    .preview-link-card-popover[data-side="top"] {
      bottom: calc(100% + var(--plc-side-offset, 8px));
      left: 50%;
      transform: translateX(-50%);
    }
    .preview-link-card-popover[data-side="left"] {
      right: calc(100% + var(--plc-side-offset, 8px));
      top: 50%;
      transform: translateY(-50%);
    }
    .preview-link-card-popover[data-side="right"] {
      left: calc(100% + var(--plc-side-offset, 8px));
      top: 50%;
      transform: translateY(-50%);
    }
    @keyframes plc-fade-in {
      from { opacity: 0; transform: translateX(-50%) translateY(4px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .preview-link-card-image {
      width: 220px;
      background: #1c1c1e;
      border-radius: 12px;
      padding: 16px;
      color: #ffffff;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-family: 'Josefin Sans', sans-serif;
    }
    .preview-link-card-image-icon {
      font-size: 22px;
      margin-bottom: 8px;
    }
    .preview-link-card-image-label {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .preview-link-card-image-href {
      font-size: 11px;
      opacity: 0.5;
      word-break: break-all;
    }
  `;
  document.head.appendChild(style);
}

/* ---------------- PreviewLinkCard ---------------- */

interface PreviewLinkCardProps {
  href: string;
  followCursor?: boolean | 'x' | 'y';
  children: ReactNode;
}

export function PreviewLinkCard({ href, children }: PreviewLinkCardProps) {
  const [hovered, setHovered] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [side, setSide] = useState<Side>('bottom');
  const [sideOffset, setSideOffset] = useState(8);
  const [align, setAlign] = useState<Align>('center');
  const [alignOffset, setAlignOffset] = useState(0);

  useEffect(() => {
    injectStylesOnce();
  }, []);

  function setPosition(p: { side?: Side; sideOffset?: number; align?: Align; alignOffset?: number }) {
    if (p.side) setSide(p.side);
    if (p.sideOffset !== undefined) setSideOffset(p.sideOffset);
    if (p.align) setAlign(p.align);
    if (p.alignOffset !== undefined) setAlignOffset(p.alignOffset);
  }

  return (
    <Ctx.Provider
      value={{ href, hovered, setHovered, content, setContent, side, sideOffset, align, alignOffset, setPosition }}
    >
      {children}
    </Ctx.Provider>
  );
}

/* ---------------- PreviewLinkCardTrigger ---------------- */

interface PreviewLinkCardTriggerProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onMouseEnter' | 'onMouseLeave'> {
  children: ReactNode;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function PreviewLinkCardTrigger({ children, style, onMouseEnter, onMouseLeave, ...props }: PreviewLinkCardTriggerProps) {
  const { href, hovered, setHovered, content, side, sideOffset, align, alignOffset } = useCtx();
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter(e: React.MouseEvent<HTMLElement>) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setHovered(true);
    onMouseEnter?.(e);
  }

  function handleLeave(e: React.MouseEvent<HTMLElement>) {
    closeTimeout.current = setTimeout(() => setHovered(false), 120);
    onMouseLeave?.(e);
  }

  const anchorStyle: CSSProperties = { position: 'relative', ...style };

  return (
    <a
      href={href}
      style={anchorStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
      {hovered && content && (
        <div
          className="preview-link-card-popover"
          data-side={side}
          data-align={align}
          style={
            {
              '--plc-side-offset': `${sideOffset}px`,
              '--plc-align-offset': `${alignOffset}px`,
            } as CSSProperties
          }
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {content}
        </div>
      )}
    </a>
  );
}

/* ---------------- PreviewLinkCardContent ---------------- */

interface PreviewLinkCardContentProps {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  target?: string;
  children: ReactNode;
}

export function PreviewLinkCardContent({ side, sideOffset, align, alignOffset, children }: PreviewLinkCardContentProps) {
  const { setContent, setPosition } = useCtx();

  useEffect(() => {
    setPosition({ side, sideOffset, align, alignOffset });
    setContent(children);
    return () => setContent(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, side, sideOffset, align, alignOffset]);

  return null;
}

/* ---------------- PreviewLinkCardImage ---------------- */

interface PreviewLinkCardImageProps {
  alt: string;
}

export function PreviewLinkCardImage({ alt }: PreviewLinkCardImageProps) {
  const { href } = useCtx();

  return (
    <div className="preview-link-card-image">
      <div className="preview-link-card-image-icon">🔗</div>
      <div className="preview-link-card-image-label">{alt}</div>
      <div className="preview-link-card-image-href">{href}</div>
    </div>
  );
}