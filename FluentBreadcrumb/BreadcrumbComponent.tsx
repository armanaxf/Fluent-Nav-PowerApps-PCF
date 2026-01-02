import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    FluentProvider,
    webLightTheme,
} from "@fluentui/react-components";
import * as FluentIcons from "@fluentui/react-icons";

export interface BreadcrumbItemData {
    key: string;
    name: string;
    icon?: string;
}

export interface FluentBreadcrumbProps {
    items: BreadcrumbItemData[];
    onItemSelect: (key: string) => void;
}

// Helper to resolve icons dynamically from Fluent UI icons
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
    const { items, onItemSelect } = props;

    // FluentProvider with fallback theme for test harness
    // In Power Apps runtime, the platform provides the theme context
    return (
        <FluentProvider theme={webLightTheme} style={{ background: "transparent", width: "100%" }}>
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
