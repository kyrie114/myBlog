import type {Config} from 'tailwindcss'
// @ts-ignore
import typography from '@tailwindcss/typography'

const config: Config = {
    plugins: [typography],
    darkMode: "class",
    content: [
        './app/**/*.{js,ts,vue}',
        './components/**/*.{js,ts,vue}',
    ],
    theme: {
        extend: {
            colors: {
                "tertiary-dim": "#53506b",
                "error-dim": "#4e0309",
                "outline": "#717c84",
                "on-surface": "#29343a",
                "surface-variant": "#d9e4ec",
                "on-primary-fixed": "#003b8a",
                "on-tertiary-fixed-variant": "#534f6b",
                "on-surface-variant": "#566168",
                "surface-bright": "#f7f9fc",
                "on-primary-fixed-variant": "#0056c1",
                "on-tertiary-fixed": "#36334d",
                "primary-fixed-dim": "#c4d4ff",
                "inverse-on-surface": "#9a9da0",
                "surface-tint": "#0059c7",
                "inverse-primary": "#528dff",
                "secondary-dim": "#525359",
                "on-background": "#29343a",
                "background": "#f7f9fc",
                "surface": "#f7f9fc",
                "outline-variant": "#a8b3bb",
                "secondary-fixed": "#e2e2e9",
                "surface-container": "#e8eff4",
                "tertiary": "#605c78",
                "error-container": "#fe8983",
                "surface-dim": "#cfdce5",
                "surface-container-lowest": "#ffffff",
                "tertiary-container": "#d6d0f1",
                "on-error": "#fff7f6",
                "surface-container-highest": "#d9e4ec",
                "on-secondary": "#f9f8ff",
                "inverse-surface": "#0b0f11",
                "on-secondary-fixed-variant": "#5a5b61",
                "primary": "#0059c7",
                "primary-dim": "#004eaf",
                "primary-container": "#d9e2ff",
                "on-tertiary-container": "#494661",
                "on-tertiary": "#fcf7ff",
                "tertiary-fixed-dim": "#c8c3e3",
                "surface-container-low": "#f0f4f8",
                "on-secondary-fixed": "#3e3f45",
                "error": "#9f403d",
                "on-secondary-container": "#505157",
                "on-error-container": "#752121",
                "on-primary-container": "#004dae",
                "secondary": "#5e5f65",
                "secondary-fixed-dim": "#d4d4db",
                "tertiary-fixed": "#d6d0f1",
                "on-primary": "#f7f7ff",
                "primary-fixed": "#d9e2ff",
                "surface-container-high": "#e1e9f0",
                "secondary-container": "#e2e2e9"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Plus Jakarta Sans"],
                "label": ["Plus Jakarta Sans"]
            },
            borderRadius: {"DEFAULT": "0.5rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px", "md": "0.5rem"},
        },
    },

}

export default config