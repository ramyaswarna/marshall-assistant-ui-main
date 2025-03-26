/// <reference types="carbon-components-react" />

declare module '@carbon/react' {
    export * from "carbon-components-react";

    export const Theme: React.FC<ThemeProps & {
        theme: 'white' | 'g10' | 'g90' | 'g100'
    }>;
}

declare module '@carbon/react/lib/components/ListBox' {
    import ListBox from "carbon-components-react/lib/components/ListBox";
    export =  ListBox;

}