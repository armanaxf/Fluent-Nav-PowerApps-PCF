import * as React from "react";
import {
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    MessageBarActions,
    MessageBarIntent,
    Button,
    FluentProvider,
    webLightTheme,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";

export interface FluentMessageBarComponentProps {
    message: string;
    intent: "info" | "success" | "warning" | "error";
    title?: string;
    dismissible?: boolean;
    actionText?: string;
    isDismissed: boolean;
    onDismiss?: () => void;
    onAction?: () => void;
}

export const FluentMessageBarComponent: React.FC<FluentMessageBarComponentProps> = (props) => {
    const {
        message,
        intent,
        title,
        dismissible,
        actionText,
        isDismissed,
        onDismiss,
        onAction,
    } = props;

    const handleDismiss = React.useCallback(() => {
        onDismiss?.();
    }, [onDismiss]);

    const handleAction = React.useCallback(() => {
        onAction?.();
    }, [onAction]);

    const getIntent = (): MessageBarIntent => {
        switch (intent) {
            case "success":
                return "success";
            case "warning":
                return "warning";
            case "error":
                return "error";
            case "info":
            default:
                return "info";
        }
    };

    // If dismissed, don't render anything
    if (isDismissed) {
        return null;
    }

    return (
        <FluentProvider theme={webLightTheme} style={{ width: "100%", height: "100%" }}>
            <MessageBar intent={getIntent()} style={{ width: "100%" }}>
                <MessageBarBody>
                    {title && <MessageBarTitle>{title}</MessageBarTitle>}
                    {message}
                </MessageBarBody>
                <MessageBarActions
                    containerAction={
                        dismissible ? (
                            <Button
                                appearance="transparent"
                                icon={<DismissRegular />}
                                onClick={handleDismiss}
                                aria-label="Dismiss"
                            />
                        ) : undefined
                    }
                >
                    {actionText && (
                        <Button appearance="transparent" onClick={handleAction}>
                            {actionText}
                        </Button>
                    )}
                </MessageBarActions>
            </MessageBar>
        </FluentProvider>
    );
};
