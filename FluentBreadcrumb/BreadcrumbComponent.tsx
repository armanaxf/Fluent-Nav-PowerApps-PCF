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
    containerWidth?: number; // Fallback from PCF context
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

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, onItemSelect, containerWidth: propWidth = 300, theme } = props;
    const styles = useStyles();
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Use ResizeObserver to track actual DOM width
    const [measuredWidth, setMeasuredWidth] = React.useState<number>(0);

    React.useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        // Set initial width
        setMeasuredWidth(element.offsetWidth);

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                setMeasuredWidth(width);
            }
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Use measured width if available, otherwise fall back to prop
    const containerWidth = measuredWidth > 0 ? measuredWidth : propWidth;

    // Calculate how many items to show based on width
    // ~80px per item on average
    const itemWidth = 80;
    const overflowWidth = 50;
    const maxVisibleItems = React.useMemo(() => {
        if (items.length <= 2) return items.length;

        // Always show at least first and last
        const availableForMiddle = containerWidth - (itemWidth * 2) - overflowWidth;
        const middleItemsCount = Math.max(0, Math.floor(availableForMiddle / itemWidth));

        // Total = first + middle + last
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
            <div ref={containerRef} style={{ width: "100%" }}>
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
            </div>
        </FluentProvider>
    );
};
