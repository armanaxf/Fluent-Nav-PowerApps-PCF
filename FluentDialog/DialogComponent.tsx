import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogActions,
    Button,
    FluentProvider,
    webLightTheme,
    Theme,
    useId,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

export interface FluentDialogProps {
    isOpen: boolean;
    modalType: "modal" | "non-modal" | "alert";
    title?: string;
    contentText?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    showPrimaryButton: boolean;
    showSecondaryButton: boolean;
    showCloseButton?: boolean;
    actionsPosition: "start" | "end";
    fluidActions: boolean;
    onPrimaryAction: () => void;
    onSecondaryAction: () => void;
    onClose: (reason: "close" | "dismiss" | "escape") => void;
    onOpenChange: (isOpen: boolean) => void;
    theme?: Theme;
}

export const FluentDialogComponent: React.FC<FluentDialogProps> = (props) => {
    const {
        isOpen,
        modalType,
        title = "Dialog Title",
        contentText = "This is the dialog content.",
        primaryButtonText = "OK",
        secondaryButtonText = "Cancel",
        showPrimaryButton,
        showSecondaryButton,
        showCloseButton,
        actionsPosition,
        fluidActions,
        onPrimaryAction,
        onSecondaryAction,
        onClose,
        onOpenChange,
        theme,
    } = props;

    const appliedTheme = theme ?? webLightTheme;

    // Ref for mounting the dialog inside the component container
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Determine if we should show the close button
    // Default: show for non-modal, hide for modal/alert unless explicitly set
    const shouldShowCloseButton = showCloseButton ?? modalType === "non-modal";

    const handleOpenChange = React.useCallback(
        (
            _event: React.MouseEvent | React.KeyboardEvent | KeyboardEvent,
            data: { open: boolean; type?: string }
        ) => {
            onOpenChange(data.open);

            // If dialog is closing, determine the reason
            if (!data.open) {
                if (data.type === "escapeKeyDown") {
                    onClose("escape");
                } else if (data.type === "backdropClick") {
                    onClose("dismiss");
                }
                // Note: button clicks are handled by their own handlers
            }
        },
        [onOpenChange, onClose]
    );

    const handlePrimaryClick = React.useCallback(() => {
        onPrimaryAction();
    }, [onPrimaryAction]);

    const handleSecondaryClick = React.useCallback(() => {
        onSecondaryAction();
    }, [onSecondaryAction]);

    const handleCloseClick = React.useCallback(() => {
        onClose("close");
    }, [onClose]);

    // Generate unique IDs for accessibility (using Fluent UI's useId for React 16 compatibility)
    const dialogId = useId("dialog-");
    const titleId = `${dialogId}-title`;
    const contentId = `${dialogId}-content`;

    // Determine if content is simple enough for aria-describedby
    const isSimpleContent = contentText && contentText.length < 200;

    return (
        <FluentProvider
            theme={appliedTheme}
            style={{ background: "transparent", width: "100%", height: "100%" }}
        >
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                }}
            >
                <Dialog
                    open={isOpen}
                    onOpenChange={handleOpenChange}
                    modalType={modalType}
                >
                    <DialogSurface
                        aria-labelledby={title ? titleId : undefined}
                        aria-describedby={isSimpleContent ? contentId : undefined}
                        mountNode={containerRef.current}
                    >
                        <DialogBody>
                            {title && (
                                <DialogTitle
                                    id={titleId}
                                    action={
                                        shouldShowCloseButton ? (
                                            <DialogTrigger action="close">
                                                <Button
                                                    appearance="subtle"
                                                    aria-label="Close dialog"
                                                    icon={<Dismiss24Regular />}
                                                    onClick={handleCloseClick}
                                                />
                                            </DialogTrigger>
                                        ) : null
                                    }
                                >
                                    {title}
                                </DialogTitle>
                            )}

                            {contentText && (
                                <DialogContent id={contentId}>
                                    {contentText}
                                </DialogContent>
                            )}

                            {(showPrimaryButton || showSecondaryButton) && (
                                <DialogActions
                                    position={actionsPosition}
                                    fluid={fluidActions}
                                >
                                    {showPrimaryButton && (
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button
                                                appearance="primary"
                                                onClick={handlePrimaryClick}
                                            >
                                                {primaryButtonText}
                                            </Button>
                                        </DialogTrigger>
                                    )}
                                    {showSecondaryButton && (
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button
                                                appearance="secondary"
                                                onClick={handleSecondaryClick}
                                            >
                                                {secondaryButtonText}
                                            </Button>
                                        </DialogTrigger>
                                    )}
                                </DialogActions>
                            )}
                        </DialogBody>
                    </DialogSurface>
                </Dialog>
            </div>
        </FluentProvider>
    );
};
