export interface ThemeVariant {
    name: string;
    id: string;
    type?: "light" | "dark" | undefined;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    headerColor: string;
    scrollColor: string;
    borderColor?: string;
    themeIndicator: string;
    highlight: string;
    sideBarIconColor?: string;
    buttonBackgroundColor?: string;
    buttonHoverBackgroundColor?: string;
    buttonFontColor?: string;
    buttonHoverFontColor?: string;
    textFontColor?: string;
    initialFontColor?: string;
    sideBarFontColor?: string;
    sidebarBackgroundColor?: string;
}

export interface JData {
    [key: string]: string;
}
