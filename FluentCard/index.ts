import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentCardComponent } from "./CardComponent";
import * as React from "react";

export class FluentCard implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selected = false;
    private clicked = false;

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

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const title = context.parameters.Title?.raw ?? "Card Title";
        const subtitle = context.parameters.Subtitle?.raw ?? undefined;
        const imageUrl = context.parameters.ImageUrl?.raw ?? undefined;
        const size = this.parseSize(context.parameters.Size?.raw);
        const orientation = this.parseOrientation(context.parameters.Orientation?.raw);
        const selectable = context.parameters.Selectable?.raw ?? false;

        return React.createElement(FluentCardComponent, {
            title: title,
            subtitle: subtitle,
            imageUrl: imageUrl,
            size: size,
            orientation: orientation,
            selectable: selectable,
            selected: this.selected,
            onSelect: this.handleSelect,
            onClick: this.handleClick,
        });
    }

    public getOutputs(): IOutputs {
        return {
            Selected: this.selected,
            Clicked: this.clicked,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
