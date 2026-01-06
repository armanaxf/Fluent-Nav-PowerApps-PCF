import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentCardComponent, CardAppearance } from "./CardComponent";
import * as React from "react";

export class FluentCard implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selected = false;
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

    private handleSelect = (newSelected: boolean): void => {
        this.selected = newSelected;
        this.notifyOutputChanged();
    };

    private handleCardClick = (): void => {
        this.notifyOutputChanged();
        // Fire the OnCardSelect event
        if (this.context.events?.OnCardSelect) {
            this.context.events.OnCardSelect();
        }
    };

    private handleActionClick = (): void => {
        this.notifyOutputChanged();
        // Fire the OnActionSelect event
        if (this.context.events?.OnActionSelect) {
            this.context.events.OnActionSelect();
        }
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
        this.context = context;

        const title = context.parameters.Title?.raw ?? "Card Title";
        const subtitle = context.parameters.Subtitle?.raw ?? undefined;
        const bodyContent = context.parameters.BodyContent?.raw ?? undefined;
        // Pass image as-is (including data URIs). Use placeholder only if truly empty.
        const imageRaw = context.parameters.Image?.raw;
        const image = imageRaw && imageRaw.trim() !== ""
            ? imageRaw
            : undefined; // Let component handle placeholder
        const size = this.parseSize(context.parameters.Size?.raw);
        const orientation = this.parseOrientation(context.parameters.Orientation?.raw);
        const appearance = this.parseAppearance(context.parameters.Appearance?.raw);
        const selectable = context.parameters.Selectable?.raw ?? false;
        const floatingAction = context.parameters.FloatingAction?.raw ?? false;
        const actionButtonText = context.parameters.ActionButtonText?.raw ?? undefined;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

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
            onCardClick: this.handleCardClick,
            onActionClick: this.handleActionClick,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
        });
    }

    public getOutputs(): IOutputs {
        return {
            Selected: this.selected,
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
