import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentBreadcrumbComponent, BreadcrumbItemData } from './BreadcrumbComponent';

// Mock Fluent UI components
jest.mock('@fluentui/react-components', () => {
    const original = jest.requireActual('@fluentui/react-components');
    return {
        ...original,
        FluentProvider: ({ children }: any) => {
            console.log('Rendering FluentProvider');
            return <div>{children}</div>;
        },
        Breadcrumb: ({ children }: any) => {
            console.log('Rendering Breadcrumb');
            return <div data-testid="breadcrumb">{children}</div>;
        },
        BreadcrumbItem: ({ children }: any) => <div data-testid="breadcrumb-item">{children}</div>,
        BreadcrumbButton: ({ children, onClick }: any) => (
            <button data-testid="breadcrumb-button" onClick={onClick}>{children}</button>
        ),
        BreadcrumbDivider: () => <span data-testid="breadcrumb-divider">/</span>,
        Button: ({ 'aria-label': ariaLabel, icon }: any) => (
            <button data-testid="overflow-button" aria-label={ariaLabel}>
                {icon}
                ...
            </button>
        ),
        Menu: ({ children }: any) => <div data-testid="menu">{children}</div>,
        MenuTrigger: ({ children }: any) => <div data-testid="menu-trigger">{children}</div>,
        MenuPopover: ({ children }: any) => <div data-testid="menu-popover">{children}</div>,
        MenuList: ({ children }: any) => <div data-testid="menu-list">{children}</div>,
        MenuItem: ({ children, onClick }: any) => (
            <div data-testid="menu-item" onClick={onClick}>{children}</div>
        ),
        makeStyles: () => () => ({ root: 'root-class' }),
        webLightTheme: {}, // Mock theme to ensure it exists
    };
});

// Mock Icons with Proxy
jest.mock('@fluentui/react-icons', () => new Proxy({}, {
    get: (_target, prop) => () => <span data-testid={`icon-${String(prop)}`} />
}));

describe('FluentBreadcrumbComponent', () => {
    const defaultProps = {
        items: [],
        onItemSelect: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty successfully', () => {
        render(<FluentBreadcrumbComponent {...defaultProps} />);
        expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('renders all items when count is <= 4', () => {
        const items: BreadcrumbItemData[] = [
            { key: '1', name: 'Item 1' },
            { key: '2', name: 'Item 2' },
            { key: '3', name: 'Item 3' },
            { key: '4', name: 'Item 4' },
        ];

        render(<FluentBreadcrumbComponent {...defaultProps} items={items} />);

        const buttons = screen.getAllByTestId('breadcrumb-button');
        expect(buttons).toHaveLength(4);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 4')).toBeInTheDocument();
    });

    it('renders overflow menu when count is > 4', () => {
        const items: BreadcrumbItemData[] = [
            { key: '1', name: 'Root' },
            { key: '2', name: 'Middle 1' },
            { key: '3', name: 'Middle 2' },
            { key: '4', name: 'Middle 3' },
            { key: '5', name: 'End 1' },
            { key: '6', name: 'End 2' },
        ];

        render(<FluentBreadcrumbComponent {...defaultProps} items={items} />);

        // Visible buttons: Root, End 1, End 2
        const buttons = screen.getAllByTestId('breadcrumb-button');
        expect(buttons).toHaveLength(3);
        expect(screen.getByText('Root')).toBeInTheDocument();
        expect(screen.getByText('End 1')).toBeInTheDocument();
        expect(screen.getByText('End 2')).toBeInTheDocument();

        // Overflow button should be present
        expect(screen.getByTestId('overflow-button')).toBeInTheDocument();

        // Check menu items
        const menuItems = screen.getAllByTestId('menu-item');
        expect(menuItems).toHaveLength(3);
        expect(screen.getByText('Middle 1')).toBeInTheDocument();
        expect(screen.getByText('Middle 3')).toBeInTheDocument();
    });

    it('calls onItemSelect when item is clicked', () => {
        const items = [{ key: '1', name: 'Click Me' }];
        render(<FluentBreadcrumbComponent {...defaultProps} items={items} />);

        fireEvent.click(screen.getByText('Click Me'));
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith('1');
    });

    it('calls onItemSelect when menu item is clicked', () => {
        const items = [
            { key: '1', name: 'Start' },
            { key: '2', name: 'Hidden' },
            { key: '3', name: 'Hidden 2' },
            { key: '4', name: 'Hidden 3' },
            { key: '5', name: 'End 1' },
            { key: '6', name: 'End 2' }
        ];

        render(<FluentBreadcrumbComponent {...defaultProps} items={items} />);

        // Click hidden item
        fireEvent.click(screen.getByText('Hidden'));
        expect(defaultProps.onItemSelect).toHaveBeenCalledWith('2');
    });
});
