import * as React from "react";
import {
    Toast,
    ToastTitle,
    ToastBody,
    ToastTrigger,
    Toaster,
    useToastController,
    useId,
    FluentProvider,
    webLightTheme,
    Link,
    Theme,
    ToastIntent,
    ToastPosition,
} from "@fluentui/react-components";

export interface FluentToastProps {
    // Trigger property - auto-resets after dispatch
    dispatchToast: boolean;
    dismissAllToasts: boolean;

    // Content properties
    title?: string;
    bodyText?: string;
    subtitle?: string;

    // Configuration
    intent: ToastIntent;
    position: ToastPosition;
    timeout: number;
    pauseOnHover: boolean;
    pauseOnWindowBlur: boolean;
    maxToasts: number;

    // Action
    showAction: boolean;
    actionText?: string;
    appearance?: "inverted";

    // Event handlers
    onToastDispatched: (toastId: string) => void;
    onToastDismissed: () => void;
    onActionClick: () => void;
    onStatusChange: (status: string, visibleCount: number) => void;

    // Theme from PCF
    theme?: Theme;
}

export const FluentToastComponent: React.FC<FluentToastProps> = (props) => {
    const {
        dispatchToast: shouldDispatch,
        dismissAllToasts: shouldDismissAll,
        title = "Notification",
        bodyText,
        subtitle,
        intent = "info",
        position = "bottom-end",
        timeout = 3000,
        pauseOnHover = true,
        pauseOnWindowBlur = false,
        maxToasts = 5,
        showAction = false,
        actionText = "Dismiss",
        appearance,
        onToastDispatched,
        onToastDismissed,
        onActionClick,
        onStatusChange,
        theme,
    } = props;

    const appliedTheme = theme ?? webLightTheme;
    const toasterId = useId("fluent-toaster");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { dispatchToast, dismissAllToasts } = useToastController(toasterId);

    // Track visible toast count
    const visibleCountRef = React.useRef(0);

    // Track previous dispatch state for edge detection
    const prevDispatchRef = React.useRef(false);
    const prevDismissAllRef = React.useRef(false);

    // Handle dispatch on rising edge (false -> true)
    React.useEffect(() => {
        if (shouldDispatch && !prevDispatchRef.current) {
            const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            dispatchToast(
                <Toast appearance={appearance}>
                    <ToastTitle
                        action={
                            showAction ? (
                                <ToastTrigger>
                                    <Link
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onActionClick();
                                        }}
                                    >
                                        {actionText}
                                    </Link>
                                </ToastTrigger>
                            ) : undefined
                        }
                    >
                        {title}
                    </ToastTitle>
                    {(bodyText !== undefined || subtitle !== undefined) && (
                        <ToastBody subtitle={subtitle}>{bodyText}</ToastBody>
                    )}
                </Toast>,
                {
                    intent,
                    toastId,
                    timeout,
                    pauseOnHover,
                    pauseOnWindowBlur,
                    position,
                    onStatusChange: (_e, data) => {
                        // Track visible count
                        if (data.status === "visible") {
                            visibleCountRef.current++;
                        } else if (
                            data.status === "dismissed" ||
                            data.status === "unmounted"
                        ) {
                            visibleCountRef.current = Math.max(
                                0,
                                visibleCountRef.current - 1
                            );
                        }

                        onStatusChange(data.status, visibleCountRef.current);

                        // Fire dismissed event when toast is dismissed
                        if (data.status === "dismissed") {
                            onToastDismissed();
                        }
                    },
                }
            );

            onToastDispatched(toastId);
        }
        prevDispatchRef.current = shouldDispatch;
    }, [
        shouldDispatch,
        title,
        bodyText,
        subtitle,
        intent,
        timeout,
        pauseOnHover,
        pauseOnWindowBlur,
        position,
        showAction,
        actionText,
        appearance,
        dispatchToast,
        onToastDispatched,
        onToastDismissed,
        onActionClick,
        onStatusChange,
    ]);

    // Handle dismiss all on rising edge
    React.useEffect(() => {
        if (shouldDismissAll && !prevDismissAllRef.current) {
            dismissAllToasts();
            visibleCountRef.current = 0;
            onStatusChange("unmounted", 0);
        }
        prevDismissAllRef.current = shouldDismissAll;
    }, [shouldDismissAll, dismissAllToasts, onStatusChange]);

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
                {/* 
                    Using inline mode to render toasts relative to this container
                    instead of at the viewport level. This keeps toasts inside the 
                    Power Apps canvas boundary.
                */}
                <Toaster
                    toasterId={toasterId}
                    position={position}
                    timeout={timeout}
                    limit={maxToasts}
                    pauseOnHover={pauseOnHover}
                    pauseOnWindowBlur={pauseOnWindowBlur}
                    inline={true}
                />
            </div>
        </FluentProvider>
    );
};
