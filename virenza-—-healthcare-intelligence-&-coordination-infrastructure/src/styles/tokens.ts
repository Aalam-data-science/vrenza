/**
 * VIRENZA Design Tokens & Visual Hierarchy
 * "Clinical Luxury + Swiss Medical Intelligence"
 */

export const TOKENS = {
  colors: {
    bg: '#F5F5F0',
    surface: '#FBFBF7',
    surfaceAlt: '#F4F2EE',
    inkPrimary: '#22241F',
    inkSecondary: '#5A564C',
    inkTertiary: '#7A7568',
    hairline: '#E7E4DC',
    clinical: '#3C7049',
    clinicalSoft: '#D9EBDE',
    surgical: '#3E6B8E',
    surgicalSoft: '#DDE8F0',
    amber: '#B8822E',
    amberSoft: '#FBF3DE',
    emergency: '#B03A28',
    emergencySoft: '#FBE9E7',
  },
  typography: {
    ui: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    editorial: "'Newsreader', Georgia, Cambria, serif",
    command: "'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    pill: '9999px',
  },
  shadows: {
    card: '0 1px 3px rgba(34, 36, 31, 0.04), 0 1px 2px rgba(34, 36, 31, 0.02)',
    elevated: '0 4px 14px rgba(34, 36, 31, 0.06), 0 1px 3px rgba(34, 36, 31, 0.04)',
    modal: '0 12px 32px rgba(34, 36, 31, 0.12), 0 2px 6px rgba(34, 36, 31, 0.06)',
  },
} as const;
