import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    FluentProvider,
    webLightTheme,
    makeStyles,
} from "@fluentui/react-components";
// Only import commonly used icons for breadcrumbs instead of entire library
import { HomeRegular, FolderRegular, DocumentRegular } from "@fluentui/react-icons";

export interface BreadcrumbItemData {
    key: string;
    name: string;
    icon?: string;
}

export interface FluentBreadcrumbProps {
    items: BreadcrumbItemData[];
    onItemSelect: (key: string) => void;
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflowX: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none",  // IE/Edge
        "::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Opera
        },
    },
    breadcrumbContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        minWidth: "max-content", // Ensure it doesn't wrap
    }
});

// Icon map for commonly used breadcrumb icons - keeps bundle small
const iconMap: Record<string, React.FC> = {
    HomeRegular: HomeRegular,
    FolderRegular: FolderRegular,
    DocumentRegular: DocumentRegular,
};

// Helper to resolve icons from the limited set
const resolveIcon = (iconName?: string): React.JSX.Element | undefined => {
    if (!iconName) return undefined;
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
        return <IconComponent />;
    }
    return undefined;
};

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, onItemSelect } = props;
    const styles = useStyles();

    // FluentProvider with fallback theme for test harness
    // In Power Apps runtime, the platform provides the theme context
    return (
        <FluentProvider theme={webLightTheme} style={{ background: "transparent", width: "100%" }}>
            <div className={styles.root}>
                <div className={styles.breadcrumbContainer}>
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
                </div>
            </div>
        </FluentProvider>
    );
};
