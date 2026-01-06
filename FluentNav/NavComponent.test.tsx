import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentNavComponent, NavItemData } from './NavComponent';

// Mock icons
jest.mock('@fluentui/react-icons', () => new Proxy({}, {
    get: (_target, prop) => {
        // bundleIcon returns a function that returns the component
        if (prop === 'bundleIcon') return () => () => <span data-testid="icon" />;
        return () => <span data-testid={`icon-${String(prop)}`} />;
    }
}));

// Mock Nav components
jest.mock('@fluentui/react-nav', () => {
    return {
        NavDrawer: ({ children, open, onNavItemSelect }: any) => (
            <div data-testid="nav-drawer" data-open={open}>
                {/* specialized trigger for testing onNavItemSelect */}
                <button
                    data-testid="mock-select-trigger"
                    onClick={() => onNavItemSelect?.(null, { value: 'test-key' })}
                />
                {children}
            </div>
        ),
        NavDrawerBody: ({ children }: any) => <div data-testid="nav-drawer-body">{children}</div>,
        NavCategory: ({ children, value }: any) => <div data-testid="nav-category" data-value={value}>{children}</div>,
        NavCategoryItem: ({ children }: any) => <div data-testid="nav-category-item">{children}</div>,
        NavItem: ({ children, value }: any) => <div data-testid="nav-item" data-value={value}>{children}</div>,
        NavSubItemGroup: ({ children }: any) => <div data-testid="nav-sub-item-group">{children}</div>,
        NavSubItem: ({ children, value }: any) => <div data-testid="nav-sub-item" data-value={value}>{children}</div>,
        NavSectionHeader: ({ children }: any) => <div data-testid="nav-section-header">{children}</div>,
        NavDivider: () => <div data-testid="nav-divider" />,
        AppItem: ({ children, onClick }: any) => <div data-testid="app-item" onClick={onClick}>{children}</div>,
    };
});

// Mock Tooltip/Button to simple versions
jest.mock('@fluentui/react-components', () => {
    const original = jest.requireActual('@fluentui/react-components');
    return {
        ...original,
        FluentProvider: ({ children }: any) => <div>{children}</div>,
        Tooltip: ({ children, content }: any) => <div data-tooltip={content}>{children}</div>,
        Button: ({ onClick, 'aria-label': ariaLabel }: any) => (
            <button onClick={onClick} aria-label={ariaLabel}>Hamburger</button>
        )
    };
});

describe('FluentNavComponent', () => {
    const mockItems: NavItemData[] = [
        { key: 'home', name: 'Home', icon: 'Home' },
        { key: 'settings', name: 'Settings', icon: 'Settings' }
    ];

    const defaultProps = {
        items: mockItems,
        onSelectionChange: jest.fn(),
        onOpenChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders hamburger button and drawer initially open', () => {
        render(<FluentNavComponent {...defaultProps} />);

        expect(screen.getByLabelText('Collapse navigation')).toBeInTheDocument();
        expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();
        expect(screen.getByTestId('nav-drawer')).toHaveAttribute('data-open', 'true');
    });

    it('toggles drawer when hamburger is clicked', () => {
        render(<FluentNavComponent {...defaultProps} />);
        const hamburger = screen.getByText('Hamburger');

        // Initial state open
        expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();

        // Click to collapse
        fireEvent.click(hamburger);

        // Drawer should be hidden (removed from DOM based on conditional rendering in component)
        expect(screen.queryByTestId('nav-drawer')).not.toBeInTheDocument();

        // Hamburger should verify closed state
        expect(screen.getByLabelText('Expand navigation')).toBeInTheDocument();
    });

    it('renders items correctly', () => {
        render(<FluentNavComponent {...defaultProps} />);

        // Check for items
        const items = screen.getAllByTestId('nav-item');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveAttribute('data-value', 'home');
        expect(items[1]).toHaveAttribute('data-value', 'settings');
    });

    it('calls onSelectionChange when item is selected via mock trigger', () => {
        render(<FluentNavComponent {...defaultProps} />);

        // Click the specialized trigger we put in the mock NavDrawer
        fireEvent.click(screen.getByTestId('mock-select-trigger'));

        expect(defaultProps.onSelectionChange).toHaveBeenCalledWith('test-key');
    });

    it('uses hierarchy for nested items', () => {
        const nestedItems: NavItemData[] = [
            { key: 'parent', name: 'Parent', icon: 'Home' },
            { key: 'child', name: 'Child', parentKey: 'parent' }
        ];

        render(<FluentNavComponent {...defaultProps} items={nestedItems} />);

        expect(screen.getByTestId('nav-category')).toBeInTheDocument();
        expect(screen.getByTestId('nav-category')).toHaveAttribute('data-value', 'parent');

        expect(screen.getByTestId('nav-sub-item')).toBeInTheDocument();
        expect(screen.getByTestId('nav-sub-item')).toHaveAttribute('data-value', 'child');
        expect(screen.queryByTestId('nav-item')).not.toBeInTheDocument(); // Parent is category, child is subitem
    });
});
