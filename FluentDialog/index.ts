import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentDialogComponent, FluentDialogProps } from "./DialogComponent";
import * as React from "react";

export class FluentDialog implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private userAction = "";
    private context: ComponentFramework.Context<IInputs>;

    constructor() {
        // Empty constructor
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    private handlePrimaryAction = (): void => {
        this.userAction = "primary";
        this.notifyOutputChanged();

        if (this.context.events?.OnPrimaryAction) {
            this.context.events.OnPrimaryAction();
        }
    };

    private handleSecondaryAction = (): void => {
        this.userAction = "secondary";
        this.notifyOutputChanged();

        if (this.context.events?.OnSecondaryAction) {
            this.context.events.OnSecondaryAction();
        }
    };

    private handleClose = (reason: "close" | "dismiss" | "escape"): void => {
        this.userAction = reason === "escape" ? "dismiss" : reason;
        this.notifyOutputChanged();

        if (this.context.events?.OnClose) {
            this.context.events.OnClose();
        }
    };

    private handleOpenChange = (isOpen: boolean): void => {
        if (this.context.events?.OnOpenChange) {
            this.context.events.OnOpenChange();
        }
    };

    private getModalType(value: string | null | undefined): "modal" | "non-modal" | "alert" {
        switch (value) {
            case "nonmodal":
                return "non-modal";
            case "alert":
                return "alert";
            case "modal":
            default:
                return "modal";
        }
    }

    private getActionsPosition(value: string | null | undefined): "start" | "end" {
        return value === "start" ? "start" : "end";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

        // Map PCF inputs to component props
        const props: FluentDialogProps = {
            isOpen: context.parameters.IsOpen?.raw ?? false,
            modalType: this.getModalType(context.parameters.ModalType?.raw),
            title: context.parameters.Title?.raw ?? "Dialog Title",
            contentText: context.parameters.ContentText?.raw ?? "This is the dialog content.",
            primaryButtonText: context.parameters.PrimaryButtonText?.raw ?? "OK",
            secondaryButtonText: context.parameters.SecondaryButtonText?.raw ?? "Cancel",
            showPrimaryButton: context.parameters.ShowPrimaryButton?.raw ?? true,
            showSecondaryButton: context.parameters.ShowSecondaryButton?.raw ?? true,
            showCloseButton: context.parameters.ShowCloseButton?.raw ?? undefined,
            actionsPosition: this.getActionsPosition(context.parameters.ActionsPosition?.raw),
            fluidActions: context.parameters.FluidActions?.raw ?? false,
            onPrimaryAction: this.handlePrimaryAction,
            onSecondaryAction: this.handleSecondaryAction,
            onClose: this.handleClose,
            onOpenChange: this.handleOpenChange,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
        };

        return React.createElement(FluentDialogComponent, props);
    }

    public getOutputs(): IOutputs {
        return {
            UserAction: this.userAction,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
