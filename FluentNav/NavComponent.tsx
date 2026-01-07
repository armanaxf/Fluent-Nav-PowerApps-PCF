import * as React from 'react';
import {
    FluentProvider,
    webLightTheme,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import {
    NavDrawer,
    NavDrawerHeader,
    NavDrawerBody,
    NavCategory,
    NavCategoryItem,
    NavItem,
    NavSubItemGroup,
    NavSubItem,
    NavSectionHeader,
    NavDivider,
    AppItem,
    Hamburger,
    NavDrawerProps,
} from '@fluentui/react-nav';
// Optimized: Import only essential icons to reduce bundle size
import {
    bundleIcon,
    HomeFilled,
    HomeRegular,
    SettingsFilled,
    SettingsRegular,
    DocumentFilled,
    DocumentRegular,
    GridFilled,
    GridRegular,
    PersonCircle32Regular,
    AppsFilled,
    AppsRegular,
} from '@fluentui/react-icons';

// Styles
const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground2,
    },
    navDrawer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    navDrawerBody: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    headerImage: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
});

// Header Image component with error fallback
interface HeaderImageProps {
    src: string;
    fallbackIcon?: React.FC<{ className?: string }>;
}

const HeaderImage: React.FC<HeaderImageProps> = ({ src, fallbackIcon: FallbackIcon }) => {
    const [hasError, setHasError] = React.useState(false);
    const styles = useStyles();

    if (hasError || !src) {
        return FallbackIcon ? <FallbackIcon /> : <PersonCircle32Regular />;
    }

    return (
        <img
            src={src}
            alt=""
            className={styles.headerImage}
            onError={() => setHasError(true)}
        />
    );
};

// Types
export interface NavItemData {
    key: string;
    name: string;
    icon?: string;
    parentKey?: string;
    isSectionHeader?: boolean;
    isDivider?: boolean;
}

export interface IFluentNavProps {
    items: NavItemData[];
    selectedKey?: string;
    defaultSelectedKey?: string;
    onSelectionChange: (selectedKey: string) => void;
    onOpenChange?: (isOpen: boolean) => void;
    onHeaderSelect?: () => void;
    headerTitle?: string;
    headerIcon?: string;
    headerImageUrl?: string;
    isOpen?: boolean;
    drawerType?: 'inline' | 'overlay';
    theme?: typeof webLightTheme;
}

// Optimized icon mapping - reduced set for smaller bundle
const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Home: bundleIcon(HomeFilled, HomeRegular),
    Settings: bundleIcon(SettingsFilled, SettingsRegular),
    Document: bundleIcon(DocumentFilled, DocumentRegular),
    Documents: bundleIcon(DocumentFilled, DocumentRegular),
    Grid: bundleIcon(GridFilled, GridRegular),
    Dashboard: bundleIcon(GridFilled, GridRegular),
    Apps: bundleIcon(AppsFilled, AppsRegular),
};

const getIcon = (iconName?: string): React.FC<{ className?: string }> | undefined => {
    if (!iconName) return undefined;
    return iconMap[iconName] ?? undefined;
};

// Build hierarchical structure from flat list
interface NavTreeItem extends NavItemData {
    children: NavTreeItem[];
}

const buildNavTree = (items: NavItemData[]): NavTreeItem[] => {
    const itemMap = new Map<string, NavTreeItem>();
    const rootItems: NavTreeItem[] = [];

    items.forEach((item) => {
        itemMap.set(item.key, { ...item, children: [] });
    });

    items.forEach((item) => {
        const treeItem = itemMap.get(item.key)!;
        if (item.parentKey && itemMap.has(item.parentKey)) {
            itemMap.get(item.parentKey)!.children.push(treeItem);
        } else {
            rootItems.push(treeItem);
        }
    });

    return rootItems;
};

// Render nav items recursively
const renderNavItems = (items: NavTreeItem[]): React.ReactNode[] => {
    return items.map((item) => {
        if (item.isSectionHeader) {
            return <NavSectionHeader key={item.key}>{item.name}</NavSectionHeader>;
        }

        if (item.isDivider) {
            return <NavDivider key={item.key} />;
        }

        const IconComponent = getIcon(item.icon);

        if (item.children.length > 0) {
            return (
                <NavCategory key={item.key} value={item.key}>
                    <NavCategoryItem icon={IconComponent ? <IconComponent /> : undefined}>
                        {item.name}
                    </NavCategoryItem>
                    <NavSubItemGroup>
                        {item.children.map((child) => {
                            if (child.children.length > 0) {
                                return renderNavItems([child]);
                            }
                            return (
                                <NavSubItem key={child.key} value={child.key}>
                                    {child.name}
                                </NavSubItem>
                            );
                        })}
                    </NavSubItemGroup>
                </NavCategory>
            );
        }

        return (
            <NavItem
                key={item.key}
                value={item.key}
                icon={IconComponent ? <IconComponent /> : undefined}
            >
                {item.name}
            </NavItem>
        );
    });
};

export const FluentNavComponent: React.FC<IFluentNavProps> = (props) => {
    const {
        items,
        selectedKey,
        defaultSelectedKey,
        onSelectionChange,
        onOpenChange,
        onHeaderSelect,
        headerTitle,
        headerIcon,
        headerImageUrl,
        isOpen: controlledIsOpen,
        drawerType = 'inline',
        theme,
    } = props;

    const styles = useStyles();

    const [internalIsOpen, setInternalIsOpen] = React.useState(true);
    const isOpen = controlledIsOpen ?? internalIsOpen;

    const [internalSelectedKey, setInternalSelectedKey] = React.useState<string>(
        defaultSelectedKey ?? (items.length > 0 ? items[0].key : '')
    );
    const currentSelectedKey = selectedKey ?? internalSelectedKey;

    const handleToggle = () => {
        const newIsOpen = !isOpen;
        setInternalIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
    };

    const handleNavItemSelect: NavDrawerProps['onNavItemSelect'] = (
        _event,
        data
    ) => {
        const newKey = data.value;
        setInternalSelectedKey(newKey);
        onSelectionChange(newKey);
    };

    const navTree = React.useMemo(() => buildNavTree(items), [items]);
    const HeaderIconComponent = headerIcon ? getIcon(headerIcon) : undefined;
    const appliedTheme = theme ?? webLightTheme;

    return (
        <FluentProvider theme={appliedTheme}>
            <div className={styles.root}>
                <NavDrawer
                    open={isOpen}
                    type={drawerType}
                    selectedValue={currentSelectedKey}
                    defaultSelectedValue={defaultSelectedKey}
                    onNavItemSelect={handleNavItemSelect}
                    className={styles.navDrawer}
                    multiple
                >
                    {/* NavDrawerHeader with Hamburger - standard Fluent pattern */}
                    <NavDrawerHeader>
                        <Hamburger onClick={handleToggle} />
                    </NavDrawerHeader>

                    <NavDrawerBody className={styles.navDrawerBody}>
                        {/* App header with title/icon */}
                        {headerTitle && (
                            <AppItem
                                icon={
                                    headerImageUrl ? (
                                        <HeaderImage
                                            src={headerImageUrl}
                                            fallbackIcon={HeaderIconComponent}
                                        />
                                    ) : HeaderIconComponent ? (
                                        <HeaderIconComponent />
                                    ) : (
                                        <PersonCircle32Regular />
                                    )
                                }
                                onClick={onHeaderSelect}
                                style={{ cursor: onHeaderSelect ? 'pointer' : 'default' }}
                            >
                                {headerTitle}
                            </AppItem>
                        )}
                        {renderNavItems(navTree)}
                    </NavDrawerBody>
                </NavDrawer>
            </div>
        </FluentProvider>
    );
};

export default FluentNavComponent;
