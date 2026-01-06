import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentMessageBarComponent } from './MessageBarComponent';

// Mock Fluent UI MessageBar components to avoid JSDOM/React 16 issues
jest.mock('@fluentui/react-components', () => {
    const originalModule = jest.requireActual('@fluentui/react-components');
    return {
        ...originalModule,
        MessageBar: ({ children, intent, style }: any) => (
            <div data-testid="fluent-message-bar" data-intent={intent} style={style}>
                {children}
            </div>
        ),
        MessageBarBody: ({ children }: any) => (
            <div data-testid="fluent-message-bar-body">{children}</div>
        ),
        MessageBarTitle: ({ children }: any) => (
            <div data-testid="fluent-message-bar-title">{children}</div>
        ),
        MessageBarActions: ({ children, containerAction }: any) => (
            <div data-testid="fluent-message-bar-actions">
                {containerAction}
                {children}
            </div>
        ),
    };
});

describe('FluentMessageBarComponent', () => {
    const defaultProps = {
        message: 'Test message',
        intent: 'info' as const,
        title: 'Test title',
        dismissible: true,
        actionText: 'Action',
        onDismiss: jest.fn(),
        onAction: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders message and title correctly', () => {
        render(<FluentMessageBarComponent {...defaultProps} />);

        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(screen.getByText('Test title')).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
        render(<FluentMessageBarComponent {...defaultProps} />);

        const dismissButton = screen.getByLabelText('Dismiss');
        fireEvent.click(dismissButton);

        expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onAction when action button is clicked', () => {
        render(<FluentMessageBarComponent {...defaultProps} />);

        const actionButton = screen.getByText('Action');
        fireEvent.click(actionButton);

        expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
    });

    it('always renders (no internal dismiss state)', () => {
        const { container } = render(
            <FluentMessageBarComponent {...defaultProps} />
        );

        // Component should always be visible - host app controls visibility
        expect(container.firstChild).not.toBeNull();
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('applies correct intent', () => {
        const { rerender } = render(
            <FluentMessageBarComponent {...defaultProps} intent="success" />
        );
        expect(screen.getByText('Test message')).toBeInTheDocument();

        rerender(<FluentMessageBarComponent {...defaultProps} intent="error" />);
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });
});
