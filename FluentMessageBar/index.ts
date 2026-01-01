import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentMessageBarComponent } from "./MessageBarComponent";
import * as React from "react";

export class FluentMessageBar implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private isDismissed = false;
    private actionClicked = false;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance.
     * @param context The entire property bag available to control via Context Object
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready
     * @param state A piece of data that persists in one session for a single user
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Handle dismiss event from the MessageBar component
     */
    private handleDismiss = (): void => {
        this.isDismissed = !this.isDismissed;
        this.notifyOutputChanged();
    };

    /**
     * Handle action button click from the MessageBar component
     */
    private handleAction = (): void => {
        this.actionClicked = !this.actionClicked;
        this.notifyOutputChanged();
    };

    /**
     * Parse intent string to valid intent type
     */
    private parseIntent(intentStr: string | null): "info" | "success" | "warning" | "error" {
        const intent = intentStr?.toLowerCase();
        if (intent === "success" || intent === "warning" || intent === "error") {
            return intent;
        }
        return "info";
    }

    /**
     * Called when any value in the property bag has changed.
     * @param context The entire property bag available to control via Context Object
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // Get properties from context
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
            onDismiss: this.handleDismiss,
            onAction: this.handleAction,
        });
    }

    /**
     * Returns output properties
     * @returns object based on nomenclature defined in manifest
     */
    public getOutputs(): IOutputs {
        return {
            IsDismissed: this.isDismissed,
            ActionClicked: this.actionClicked,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree.
     */
    public destroy(): void {
        // Cleanup if necessary
    }
}
