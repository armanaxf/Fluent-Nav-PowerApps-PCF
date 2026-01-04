import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    FluentProvider,
    webLightTheme,
    makeStyles,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    Button,
} from "@fluentui/react-components";
import { MoreHorizontalRegular, HomeRegular, FolderRegular, DocumentRegular } from "@fluentui/react-icons";

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
        display: "flex",
        alignItems: "center",
    },
});

// Icon map for commonly used breadcrumb icons
const iconMap: Record<string, React.FC> = {
    HomeRegular: HomeRegular,
    FolderRegular: FolderRegular,
    DocumentRegular: DocumentRegular,
};

const resolveIcon = (iconName?: string): React.JSX.Element | undefined => {
    if (!iconName) return undefined;
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
        return <IconComponent />;
    }
    return undefined;
};

// Calculate how many items fit based on container width
// For simplicity, we'll use a fixed approach: show first, "...", last 2 when > 4 items
const MAX_VISIBLE_ITEMS = 4;

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, onItemSelect } = props;
    const styles = useStyles();

    // Determine if we need overflow
    const needsOverflow = items.length > MAX_VISIBLE_ITEMS;

    // If we need overflow: show first item, "...", then last 2 items
    // Otherwise show all items
    const visibleItems = React.useMemo(() => {
        if (!needsOverflow) {
            return items;
        }
        // Show: first, [overflow menu], last 2
        return [
            items[0],
            ...items.slice(-2)
        ];
    }, [items, needsOverflow]);

    const overflowItems = React.useMemo(() => {
        if (!needsOverflow) {
            return [];
        }
        // Items between first and last 2
        return items.slice(1, -2);
    }, [items, needsOverflow]);

    return (
        <FluentProvider theme={webLightTheme} style={{ background: "transparent", width: "100%" }}>
            <Breadcrumb aria-label="Breadcrumb" className={styles.root}>
                {/* First item */}
                {visibleItems.length > 0 && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbButton
                                icon={resolveIcon(visibleItems[0].icon)}
                                onClick={() => onItemSelect(visibleItems[0].key)}
                            >
                                {visibleItems[0].name}
                            </BreadcrumbButton>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                    </>
                )}

                {/* Overflow menu (if needed) */}
                {needsOverflow && overflowItems.length > 0 && (
                    <>
                        <BreadcrumbItem>
                            <Menu>
                                <MenuTrigger>
                                    <Button
                                        appearance="subtle"
                                        icon={<MoreHorizontalRegular />}
                                        aria-label="More breadcrumb items"
                                        size="small"
                                    />
                                </MenuTrigger>
                                <MenuPopover>
                                    <MenuList>
                                        {overflowItems.map((item) => (
                                            <MenuItem
                                                key={item.key}
                                                onClick={() => onItemSelect(item.key)}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </MenuPopover>
                            </Menu>
                        </BreadcrumbItem>
                        <BreadcrumbDivider />
                    </>
                )}

                {/* Remaining visible items (skip first since already rendered) */}
                {visibleItems.slice(1).map((item, index) => {
                    const isLast = index === visibleItems.length - 2; // -2 because we sliced off first
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
