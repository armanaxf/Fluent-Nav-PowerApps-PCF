import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    FluentProvider,
    webLightTheme,
    webDarkTheme,
    teamsLightTheme,
    teamsDarkTheme,
    Theme,
} from "@fluentui/react-components";
import { bundleIcon, CalendarMonthRegular, CalendarMonthFilled, HomeRegular, HomeFilled, SettingsRegular, SettingsFilled } from "@fluentui/react-icons";
// Note: In a real dynamic icon scenario, we would need a mapping or an icon resolver. 
// For now, we will just render text, or support a few common icons if implemented in a utility.
// To keep it simple and robust, we will focus on Text support, but I will include a placeholder for icon rendering logic.
import * as FluentIcons from "@fluentui/react-icons";

export interface BreadcrumbItemData {
    key: string;
    name: string;
    icon?: string;
    isCurrentItem?: boolean;
}

export interface FluentBreadcrumbProps {
    items: BreadcrumbItemData[];
    theme: "webLight" | "webDark" | "teamsLight" | "teamsDark";
    onItemSelect: (key: string) => void;
}

// Helper to resolve theme
const getTheme = (themeName: string): Theme => {
    switch (themeName) {
        case "webDark": return webDarkTheme;
        case "teamsLight": return teamsLightTheme;
        case "teamsDark": return teamsDarkTheme;
        case "webLight":
        default: return webLightTheme;
    }
};

// Helper (simplified) to resolve icons dynamically
// This is heavy if we import everything, but for a PCF we might rely on specific set or lazy load. 
// For this v1, checking if the string matches a known export in the global bundle if available or just skipping.
// Actually, using the icon string as a key into the imported * as FluentIcons is possible but increases bundle size.
// Let's implement safe lookup.
const resolveIcon = (iconName?: string): React.JSX.Element | undefined => {
    if (!iconName) return undefined;

    // Try to find the icon in the imported set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const IconComponent = (FluentIcons as any)[iconName];
    if (IconComponent) {
        return <IconComponent />;
    }
    return undefined;
};

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, theme, onItemSelect } = props;

    return (
        <FluentProvider theme={getTheme(theme)} style={{ background: "transparent", width: "100%" }}>
            <Breadcrumb aria-label="Breadcrumb">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const Icon = resolveIcon(item.icon);

                    return (
                        <React.Fragment key={item.key}>
                            <BreadcrumbItem>
                                <BreadcrumbButton
                                    icon={Icon}
                                    onClick={() => onItemSelect(item.key)}
                                    current={isLast}
                                >
                                    {item.name}
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbDivider />}
                        </React.Fragment>
                    );
                })}
            </Breadcrumb>
        </FluentProvider>
    );
};
