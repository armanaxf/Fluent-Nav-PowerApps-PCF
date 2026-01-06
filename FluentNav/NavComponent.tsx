import * as React from 'react';
import {
    FluentProvider,
    webLightTheme,
    Tooltip,
    makeStyles,
    tokens,
    Button,
    mergeClasses,
} from '@fluentui/react-components';
import {
    NavDrawer,
    NavDrawerBody,
    NavCategory,
    NavCategoryItem,
    NavItem,
    NavSubItemGroup,
    NavSubItem,
    NavSectionHeader,
    NavDivider,
    AppItem,
    NavDrawerProps,
} from '@fluentui/react-nav';
import {
    bundleIcon,
    HomeFilled,
    HomeRegular,
    SettingsFilled,
    SettingsRegular,
    PersonFilled,
    PersonRegular,
    CalendarFilled,
    CalendarRegular,
    MailFilled,
    MailRegular,
    DocumentFilled,
    DocumentRegular,
    ChatFilled,
    ChatRegular,
    PeopleFilled,
    PeopleRegular,
    SearchFilled,
    SearchRegular,
    AppsFilled,
    AppsRegular,
    GridFilled,
    GridRegular,
    PersonCircle32Regular,
    Board20Filled,
    Board20Regular,
    MegaphoneLoud20Filled,
    MegaphoneLoud20Regular,
    HeartPulse20Filled,
    HeartPulse20Regular,
    BoxMultiple20Filled,
    BoxMultiple20Regular,
    NotePin20Filled,
    NotePin20Regular,
    DataArea20Filled,
    DataArea20Regular,
    DocumentBulletListMultiple20Filled,
    DocumentBulletListMultiple20Regular,
    Navigation20Regular,
} from '@fluentui/react-icons';

// Drawer width when expanded
const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 48;

// Styles
const useStyles = makeStyles({
    root: {
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground2,
        transition: 'width 0.2s ease-in-out',
    },
    rootExpanded: {
        width: `${DRAWER_WIDTH}px`,
    },
    rootCollapsed: {
        width: `${COLLAPSED_WIDTH}px`,
    },
    // Top toggle area - contains hamburger, always visible
    toggleArea: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        boxSizing: 'border-box',
        backgroundColor: tokens.colorNeutralBackground2,
    },
    hamburgerButton: {
        minWidth: '32px',
        minHeight: '32px',
    },
    // Drawer container - expands/collapses
    drawerContainer: {
        flex: 1,
        overflow: 'hidden',
        transition: 'opacity 0.2s ease-in-out',
    },
    drawerContainerOpen: {
        opacity: 1,
    },
    drawerContainerClosed: {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
    },
    navDrawer: {
        height: '100%',
        width: '100%',
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

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Home: bundleIcon(HomeFilled, HomeRegular),
    Settings: bundleIcon(SettingsFilled, SettingsRegular),
    Person: bundleIcon(PersonFilled, PersonRegular),
    Calendar: bundleIcon(CalendarFilled, CalendarRegular),
    Mail: bundleIcon(MailFilled, MailRegular),
    Document: bundleIcon(DocumentFilled, DocumentRegular),
    Chat: bundleIcon(ChatFilled, ChatRegular),
    People: bundleIcon(PeopleFilled, PeopleRegular),
    Search: bundleIcon(SearchFilled, SearchRegular),
    Apps: bundleIcon(AppsFilled, AppsRegular),
    Grid: bundleIcon(GridFilled, GridRegular),
    Dashboard: bundleIcon(Board20Filled, Board20Regular),
    Board: bundleIcon(Board20Filled, Board20Regular),
    Announcements: bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular),
    Megaphone: bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular),
    Health: bundleIcon(HeartPulse20Filled, HeartPulse20Regular),
    HeartPulse: bundleIcon(HeartPulse20Filled, HeartPulse20Regular),
    Training: bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular),
    BoxMultiple: bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular),
    JobPostings: bundleIcon(NotePin20Filled, NotePin20Regular),
    NotePin: bundleIcon(NotePin20Filled, NotePin20Regular),
    Analytics: bundleIcon(DataArea20Filled, DataArea20Regular),
    DataArea: bundleIcon(DataArea20Filled, DataArea20Regular),
    Reports: bundleIcon(DocumentBulletListMultiple20Filled, DocumentBulletListMultiple20Regular),
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
            <div className={mergeClasses(
                styles.root,
                isOpen ? styles.rootExpanded : styles.rootCollapsed
            )}>
                {/* Top Toggle Area - ALWAYS visible with hamburger */}
                <div className={styles.toggleArea}>
                    <Tooltip content={isOpen ? "Collapse navigation" : "Expand navigation"} relationship="label">
                        <Button
                            appearance="subtle"
                            icon={<Navigation20Regular />}
                            onClick={handleToggle}
                            className={styles.hamburgerButton}
                            aria-label={isOpen ? "Collapse navigation" : "Expand navigation"}
                        />
                    </Tooltip>
                </div>

                {/* Drawer Container - expands/collapses vertically */}
                <div className={mergeClasses(
                    styles.drawerContainer,
                    isOpen ? styles.drawerContainerOpen : styles.drawerContainerClosed
                )}>
                    {isOpen && (
                        <NavDrawer
                            open={true}
                            type={drawerType}
                            selectedValue={currentSelectedKey}
                            defaultSelectedValue={defaultSelectedKey}
                            onNavItemSelect={handleNavItemSelect}
                            className={styles.navDrawer}
                            multiple
                        >
                            <NavDrawerBody>
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
                    )}
                </div>
            </div>
        </FluentProvider>
    );
};

export default FluentNavComponent;
