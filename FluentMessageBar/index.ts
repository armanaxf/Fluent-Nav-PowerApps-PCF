import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentMessageBarComponent } from "./MessageBarComponent";
import * as React from "react";

export class FluentMessageBar implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private isDismissed = false;
    private actionClicked = false;
    private context: ComponentFramework.Context<IInputs>;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    private handleDismiss = (): void => {
        this.isDismissed = true;
        this.notifyOutputChanged();
        // Fire the OnDismiss event
        if (this.context.events?.OnDismiss) {
            this.context.events.OnDismiss();
        }
    };

    private handleAction = (): void => {
        this.actionClicked = !this.actionClicked;
        this.notifyOutputChanged();
        // Fire the OnAction event
        if (this.context.events?.OnAction) {
            this.context.events.OnAction();
        }
    };

    private parseIntent(intentStr: string | null): "info" | "success" | "warning" | "error" {
        const intent = intentStr?.toLowerCase();
        if (intent === "success" || intent === "warning" || intent === "error") {
            return intent;
        }
        return "info";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;

        const message = context.parameters.Message?.raw ?? "This is a message";
        const intent = this.parseIntent(context.parameters.Intent?.raw);
        const title = context.parameters.Title?.raw ?? undefined;
        const dismissible = context.parameters.Dismissible?.raw ?? false;
        const actionText = context.parameters.ActionText?.raw ?? undefined;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

        return React.createElement(FluentMessageBarComponent, {
            message: message,
            intent: intent,
            title: title,
            dismissible: dismissible,
            actionText: actionText,
            isDismissed: this.isDismissed,
            onDismiss: this.handleDismiss,
            onAction: this.handleAction,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
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
