import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentCardComponent, FluentCardProps } from './CardComponent';

// Mock Fluent UI components
jest.mock('@fluentui/react-components', () => {
    const original = jest.requireActual('@fluentui/react-components');
    return {
        ...original,
        FluentProvider: ({ children }: any) => <div>{children}</div>,
        Card: ({ children, onClick }: any) => <div data-testid="card" onClick={onClick}>{children}</div>,
        CardHeader: ({ header, description }: any) => (
            <div data-testid="card-header">
                <div data-testid="card-header-title">{header}</div>
                <div data-testid="card-header-desc">{description}</div>
            </div>
        ),
        CardPreview: ({ children }: any) => <div data-testid="card-preview">{children}</div>,
        CardFooter: ({ children }: any) => <div data-testid="card-footer">{children}</div>,
        Text: ({ children }: any) => <span>{children}</span>,
        Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
        Checkbox: ({ checked, onChange }: any) => (
            <input
                type="checkbox"
                checked={checked || false}
                onChange={(e) => onChange(e, { checked: e.target.checked })}
                data-testid="checkbox"
            />
        ),
        makeStyles: () => () => ({
            root: 'root-class',
            card: 'card-class',
            preview: 'preview-class',
            checkbox: 'checkbox-class'
        }),
    };
});

describe('FluentCardComponent', () => {
    const defaultProps: FluentCardProps = {
        title: 'Test Card',
        subtitle: 'Subtitle',
        bodyContent: 'Body content',
        image: '',
        size: 'medium',
        orientation: 'vertical',
        appearance: 'filled',
        selectable: false,
        floatingAction: false,
        actionButtonText: '',
        selected: false,
        onSelect: jest.fn(),
        onCardClick: jest.fn(),
        onActionClick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title, subtitle, and body', () => {
        render(<FluentCardComponent {...defaultProps} />);

        expect(screen.getByText('Test Card')).toBeInTheDocument();
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
        expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders image when provided', () => {
        render(<FluentCardComponent {...defaultProps} image="test.jpg" />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test.jpg');
        expect(screen.getByTestId('card-preview')).toBeInTheDocument();
    });

    it('renders action button when text provided', () => {
        render(<FluentCardComponent {...defaultProps} actionButtonText="Action" />);

        const btn = screen.getByText('Action');
        expect(btn).toBeInTheDocument();
        expect(screen.getByTestId('card-footer')).toBeInTheDocument();

        fireEvent.click(btn);
        expect(defaultProps.onActionClick).toHaveBeenCalled();
    });

    it('handles card click', () => {
        render(<FluentCardComponent {...defaultProps} />);

        fireEvent.click(screen.getByTestId('card'));
        expect(defaultProps.onCardClick).toHaveBeenCalled();
    });

    it('handles checkbox selection', () => {
        render(<FluentCardComponent {...defaultProps} selectable={true} floatingAction={true} />);

        const checkbox = screen.getByTestId('checkbox');
        fireEvent.click(checkbox);

        expect(defaultProps.onSelect).toHaveBeenCalledWith(true);
    });
});
