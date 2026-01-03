import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentCardComponent, CardAppearance } from "./CardComponent";
import * as React from "react";

export class FluentCard implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selected = false;
    private clicked = false;
    private actionClicked = false;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    private handleSelect = (newSelected: boolean): void => {
        this.selected = newSelected;
        this.notifyOutputChanged();
    };

    private handleClick = (): void => {
        this.clicked = !this.clicked;
        this.notifyOutputChanged();
    };

    private handleActionClick = (): void => {
        this.actionClicked = !this.actionClicked;
        this.notifyOutputChanged();
    };

    private parseSize(sizeStr: string | null): "small" | "medium" | "large" {
        const size = sizeStr?.toLowerCase();
        if (size === "small" || size === "large") {
            return size;
        }
        return "medium";
    }

    private parseOrientation(orientationStr: string | null): "vertical" | "horizontal" {
        const orientation = orientationStr?.toLowerCase();
        if (orientation === "horizontal") {
            return orientation;
        }
        return "vertical";
    }

    private parseAppearance(appearanceStr: string | null): CardAppearance {
        const appearance = appearanceStr?.toLowerCase();
        if (appearance === "filled-alternative" || appearance === "outline" || appearance === "subtle") {
            return appearance;
        }
        return "filled";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const title = context.parameters.Title?.raw ?? "Card Title";
        const subtitle = context.parameters.Subtitle?.raw ?? undefined;
        const bodyContent = context.parameters.BodyContent?.raw ?? undefined;
        const image = context.parameters.Image?.raw ?? undefined;
        const size = this.parseSize(context.parameters.Size?.raw);
        const orientation = this.parseOrientation(context.parameters.Orientation?.raw);
        const appearance = this.parseAppearance(context.parameters.Appearance?.raw);
        const selectable = context.parameters.Selectable?.raw ?? false;
        const floatingAction = context.parameters.FloatingAction?.raw ?? false;
        const actionButtonText = context.parameters.ActionButtonText?.raw ?? undefined;

        return React.createElement(FluentCardComponent, {
            title: title,
            subtitle: subtitle,
            bodyContent: bodyContent,
            image: image,
            size: size,
            orientation: orientation,
            appearance: appearance,
            selectable: selectable,
            floatingAction: floatingAction,
            actionButtonText: actionButtonText,
            selected: this.selected,
            onSelect: this.handleSelect,
            onClick: this.handleClick,
            onActionClick: this.handleActionClick,
        });
    }

    public getOutputs(): IOutputs {
        return {
            Selected: this.selected,
            Clicked: this.clicked,
            ActionClicked: this.actionClicked,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
