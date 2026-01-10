import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentToastComponent, FluentToastProps } from "./ToastComponent";
import * as React from "react";
import type { ToastIntent, ToastPosition } from "@fluentui/react-components";

export class FluentToast
    implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;

    // Output state
    private toastStatus = "";
    private lastToastId = "";
    private actionClicked = false;
    private visibleToastCount = 0;

    constructor() {
        // Empty constructor
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    private handleToastDispatched = (toastId: string): void => {
        this.lastToastId = toastId;
        this.notifyOutputChanged();

        if (this.context.events?.OnToastDispatched) {
            this.context.events.OnToastDispatched();
        }
    };

    private handleToastDismissed = (): void => {
        if (this.context.events?.OnToastDismissed) {
            this.context.events.OnToastDismissed();
        }
    };

    private handleActionClick = (): void => {
        this.actionClicked = true;
        this.notifyOutputChanged();

        if (this.context.events?.OnActionClick) {
            this.context.events.OnActionClick();
        }
    };

    private handleStatusChange = (
        status: string,
        visibleCount: number
    ): void => {
        this.toastStatus = status;
        this.visibleToastCount = visibleCount;
        this.notifyOutputChanged();

        if (this.context.events?.OnStatusChange) {
            this.context.events.OnStatusChange();
        }
    };

    private getIntent(value: string | null | undefined): ToastIntent {
        switch (value) {
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
    }

    private getPosition(value: string | null | undefined): ToastPosition {
        switch (value) {
            case "bottom":
                return "bottom";
            case "bottom-start":
                return "bottom-start";
            case "top":
                return "top";
            case "top-start":
                return "top-start";
            case "top-end":
                return "top-end";
            case "bottom-end":
            default:
                return "bottom-end";
        }
    }

    private getAppearance(
        value: string | null | undefined
    ): "inverted" | undefined {
        return value === "inverted" ? "inverted" : undefined;
    }

    public updateView(
        context: ComponentFramework.Context<IInputs>
    ): React.ReactElement {
        this.context = context;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

        // Map PCF inputs to component props
        const props: FluentToastProps = {
            dispatchToast: context.parameters.DispatchToast?.raw ?? false,
            dismissAllToasts: context.parameters.DismissAllToasts?.raw ?? false,
            title: context.parameters.Title?.raw ?? "Notification",
            bodyText: context.parameters.BodyText?.raw ?? undefined,
            subtitle: context.parameters.Subtitle?.raw ?? undefined,
            intent: this.getIntent(context.parameters.Intent?.raw),
            position: this.getPosition(context.parameters.Position?.raw),
            timeout: context.parameters.Timeout?.raw ?? 3000,
            pauseOnHover: context.parameters.PauseOnHover?.raw ?? true,
            pauseOnWindowBlur: context.parameters.PauseOnWindowBlur?.raw ?? false,
            maxToasts: context.parameters.MaxToasts?.raw ?? 5,
            showAction: context.parameters.ShowAction?.raw ?? false,
            actionText: context.parameters.ActionText?.raw ?? "Dismiss",
            appearance: this.getAppearance(context.parameters.Appearance?.raw),
            onToastDispatched: this.handleToastDispatched,
            onToastDismissed: this.handleToastDismissed,
            onActionClick: this.handleActionClick,
            onStatusChange: this.handleStatusChange,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
        };

        return React.createElement(FluentToastComponent, props);
    }

    public getOutputs(): IOutputs {
        return {
            ToastStatus: this.toastStatus,
            LastToastId: this.lastToastId,
            ActionClicked: this.actionClicked,
            VisibleToastCount: this.visibleToastCount,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
