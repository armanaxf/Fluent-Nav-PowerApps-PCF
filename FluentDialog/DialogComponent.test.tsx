import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FluentDialogComponent, FluentDialogProps } from "./DialogComponent";

// Mock the Fluent UI icons
jest.mock("@fluentui/react-icons", () => ({
    Dismiss24Regular: () => <span data-testid="dismiss-icon">X</span>,
}));

describe("FluentDialogComponent", () => {
    const defaultProps: FluentDialogProps = {
        isOpen: true,
        modalType: "modal",
        title: "Test Dialog",
        contentText: "This is test content",
        primaryButtonText: "OK",
        secondaryButtonText: "Cancel",
        showPrimaryButton: true,
        showSecondaryButton: true,
        showCloseButton: false,
        actionsPosition: "end",
        fluidActions: false,
        onPrimaryAction: jest.fn(),
        onSecondaryAction: jest.fn(),
        onClose: jest.fn(),
        onOpenChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders dialog with title and content when open", () => {
            render(<FluentDialogComponent {...defaultProps} />);

            expect(screen.getByText("Test Dialog")).toBeInTheDocument();
            expect(screen.getByText("This is test content")).toBeInTheDocument();
        });

        it("renders primary button when showPrimaryButton is true", () => {
            render(<FluentDialogComponent {...defaultProps} />);

            expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
        });

        it("renders secondary button when showSecondaryButton is true", () => {
            render(<FluentDialogComponent {...defaultProps} />);

            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("hides primary button when showPrimaryButton is false", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    showPrimaryButton={false}
                />
            );

            expect(screen.queryByRole("button", { name: "OK" })).not.toBeInTheDocument();
        });

        it("hides secondary button when showSecondaryButton is false", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    showSecondaryButton={false}
                />
            );

            expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
        });

        it("shows close button for non-modal dialogs by default", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    modalType="non-modal"
                    showCloseButton={undefined}
                />
            );

            expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
        });

        it("hides close button for modal dialogs by default", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    modalType="modal"
                    showCloseButton={undefined}
                />
            );

            expect(screen.queryByRole("button", { name: "Close dialog" })).not.toBeInTheDocument();
        });

        it("uses custom button text", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    primaryButtonText="Confirm"
                    secondaryButtonText="Dismiss"
                />
            );

            expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
        });
    });

    describe("Modal Types", () => {
        it("renders modal type correctly", () => {
            const { container } = render(
                <FluentDialogComponent {...defaultProps} modalType="modal" />
            );

            // Modal dialog should have a backdrop
            expect(container.querySelector("[role='dialog']")).toBeInTheDocument();
        });

        it("renders non-modal type correctly", () => {
            const { container } = render(
                <FluentDialogComponent {...defaultProps} modalType="non-modal" />
            );

            expect(container.querySelector("[role='dialog']")).toBeInTheDocument();
        });

        it("renders alert type correctly", () => {
            const { container } = render(
                <FluentDialogComponent {...defaultProps} modalType="alert" />
            );

            // Alert dialog should have alertdialog role
            expect(container.querySelector("[role='alertdialog']")).toBeInTheDocument();
        });
    });

    describe("Interactions", () => {
        it("calls onPrimaryAction when primary button is clicked", () => {
            const onPrimaryAction = jest.fn();
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    onPrimaryAction={onPrimaryAction}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "OK" }));

            expect(onPrimaryAction).toHaveBeenCalledTimes(1);
        });

        it("calls onSecondaryAction when secondary button is clicked", () => {
            const onSecondaryAction = jest.fn();
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    onSecondaryAction={onSecondaryAction}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

            expect(onSecondaryAction).toHaveBeenCalledTimes(1);
        });

        it("calls onClose with 'close' when close button is clicked", () => {
            const onClose = jest.fn();
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    modalType="non-modal"
                    onClose={onClose}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));

            expect(onClose).toHaveBeenCalledWith("close");
        });
    });

    describe("Accessibility", () => {
        it("has proper aria-labelledby when title is provided", () => {
            render(<FluentDialogComponent {...defaultProps} />);

            const dialog = screen.getByRole("dialog");
            expect(dialog).toHaveAttribute("aria-labelledby");
        });

        it("has proper aria-describedby for simple content", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    contentText="Short content"
                />
            );

            const dialog = screen.getByRole("dialog");
            expect(dialog).toHaveAttribute("aria-describedby");
        });

        it("does not set aria-describedby for long content", () => {
            const longContent = "A".repeat(250);
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    contentText={longContent}
                />
            );

            const dialog = screen.getByRole("dialog");
            expect(dialog).not.toHaveAttribute("aria-describedby");
        });

        it("close button has accessible label", () => {
            render(
                <FluentDialogComponent
                    {...defaultProps}
                    modalType="non-modal"
                />
            );

            expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
        });
    });

    describe("Actions Layout", () => {
        it("applies fluid prop to actions", () => {
            const { container } = render(
                <FluentDialogComponent {...defaultProps} fluidActions={true} />
            );

            // Check that buttons container exists
            const actionsContainer = container.querySelector("[class*='fui-DialogActions']");
            expect(actionsContainer).toBeInTheDocument();
        });
    });

    describe("Theming", () => {
        it("renders with default theme when no theme provided", () => {
            const { container } = render(
                <FluentDialogComponent {...defaultProps} theme={undefined} />
            );

            // FluentProvider should be present
            expect(container.querySelector("[class*='fui-FluentProvider']")).toBeInTheDocument();
        });
    });
});
