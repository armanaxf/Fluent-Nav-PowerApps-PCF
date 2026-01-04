import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentMessageBarComponent } from "./MessageBarComponent";
import * as React from "react";

export class FluentMessageBar implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private isDismissed = false;
    private actionClicked = false;
    private lastResetDismiss: boolean | null = null;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        // Initialize lastResetDismiss to current value
        this.lastResetDismiss = context.parameters.ResetDismiss?.raw ?? false;
    }

    private handleDismiss = (): void => {
        this.isDismissed = true;
        this.notifyOutputChanged();
    };

    private handleAction = (): void => {
        this.actionClicked = !this.actionClicked;
        this.notifyOutputChanged();
    };

    private parseIntent(intentStr: string | null): "info" | "success" | "warning" | "error" {
        const intent = intentStr?.toLowerCase();
        if (intent === "success" || intent === "warning" || intent === "error") {
            return intent;
        }
        return "info";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // Check if ResetDismiss changed - if toggled, reset dismissed state
        const currentResetDismiss = context.parameters.ResetDismiss?.raw ?? false;
        if (currentResetDismiss !== this.lastResetDismiss) {
            this.lastResetDismiss = currentResetDismiss;
            // Reset dismissed state when ResetDismiss is toggled
            if (this.isDismissed) {
                this.isDismissed = false;
            }
        }

        const message = context.parameters.Message?.raw ?? "This is a message";
        const intent = this.parseIntent(context.parameters.Intent?.raw);
        const title = context.parameters.Title?.raw ?? undefined;
        const dismissible = context.parameters.Dismissible?.raw ?? false;
        const actionText = context.parameters.ActionText?.raw ?? undefined;

        return React.createElement(FluentMessageBarComponent, {
            message: message,
            intent: intent,
            title: title,
            dismissible: dismissible,
            actionText: actionText,
            isDismissed: this.isDismissed,
            onDismiss: this.handleDismiss,
            onAction: this.handleAction,
        });
    }

    public getOutputs(): IOutputs {
        return {
            IsDismissed: this.isDismissed,
            ActionClicked: this.actionClicked,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
