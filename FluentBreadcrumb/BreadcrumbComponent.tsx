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
    Theme,
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
    containerWidth?: number;
    theme?: Theme;
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

// Calculate max visible items based on container width
// Average item width ~100px, overflow button ~40px, dividers ~20px
const calculateMaxVisible = (containerWidth: number, totalItems: number): number => {
    if (containerWidth <= 0) return 4; // Default

    const avgItemWidth = 100;
    const overflowButtonWidth = 50;
    const dividerWidth = 20;

    // If we have few items, show all
    if (totalItems <= 2) return totalItems;

    // Calculate how many items fit
    // Formula: first + overflow + last + some middle = container width
    // We always show first and last, so calculate remaining space for middle items
    const availableWidth = containerWidth - overflowButtonWidth;
    const itemsWithDividers = Math.floor(availableWidth / (avgItemWidth + dividerWidth));

    // Minimum: show first and last (2 items)
    // If we can fit more, show them
    const maxItems = Math.max(2, Math.min(totalItems, itemsWithDividers));

    return maxItems;
};

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, onItemSelect, containerWidth = 300, theme } = props;
    const styles = useStyles();

    // Calculate how many items to show based on width
    // We'll use a simple heuristic: ~80px per item on average
    const itemWidth = 80;
    const overflowWidth = 50;
    const maxVisibleItems = React.useMemo(() => {
        if (items.length <= 2) return items.length;

        // Always show at least first and last
        const availableForMiddle = containerWidth - (itemWidth * 2) - overflowWidth;
        const middleItemsCount = Math.max(0, Math.floor(availableForMiddle / itemWidth));

        // Total = first + middle + last
        // If middleItemsCount < items.length - 2, we need overflow
        return Math.min(items.length, 2 + middleItemsCount);
    }, [containerWidth, items.length]);

    // Determine if we need overflow
    const needsOverflow = items.length > maxVisibleItems;

    // If we need overflow: show first item, "...", then last N items
    const visibleItems = React.useMemo(() => {
        if (!needsOverflow) {
            return items;
        }
        // How many items to show at the end (excluding first)?
        const endItemsCount = Math.max(1, maxVisibleItems - 1);
        return [
            items[0],
            ...items.slice(-endItemsCount)
        ];
    }, [items, needsOverflow, maxVisibleItems]);

    const overflowItems = React.useMemo(() => {
        if (!needsOverflow) {
            return [];
        }
        const endItemsCount = Math.max(1, maxVisibleItems - 1);
        // Items between first and the end items we show
        return items.slice(1, items.length - endItemsCount);
    }, [items, needsOverflow, maxVisibleItems]);

    const appliedTheme = theme ?? webLightTheme;

    return (
        <FluentProvider theme={appliedTheme} style={{ background: "transparent", width: "100%" }}>
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
