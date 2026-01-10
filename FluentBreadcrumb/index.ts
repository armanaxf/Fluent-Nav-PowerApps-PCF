import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentBreadcrumbComponent, BreadcrumbItemData } from "./BreadcrumbComponent";
import * as React from "react";

export class FluentBreadcrumb implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedKey = "";
    private context: ComponentFramework.Context<IInputs>;
    private containerWidth = 0;

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

    private handleItemSelect = (key: string): void => {
        this.selectedKey = key;
        this.notifyOutputChanged();
        // Fire the OnSelect event
        if (this.context.events?.OnSelect) {
            this.context.events.OnSelect();
        }
    };

    private mapDatasetToItems(context: ComponentFramework.Context<IInputs>): BreadcrumbItemData[] {
        const dataset = context.parameters.items;
        const items: BreadcrumbItemData[] = [];

        if (!dataset?.sortedRecordIds || dataset.sortedRecordIds.length === 0) {
            // Return default placeholder items to help users understand the structure
            return [
                { key: "home", name: "Home", icon: "HomeRegular" },
                { key: "products", name: "Products" },
                { key: "electronics", name: "Electronics" },
                { key: "phones", name: "Phones" },
            ];
        }

        for (const recordId of dataset.sortedRecordIds) {
            const record = dataset.records[recordId];
            items.push({
                key: (record.getValue("ItemKey") as string) ?? recordId,
                name: (record.getValue("ItemName") as string) ?? "",
                icon: (record.getValue("ItemIcon") as string) ?? undefined,
            });
        }
        return items;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;
        const items = this.mapDatasetToItems(context);

        // Get container width from allocatedWidth
        const containerWidth = context.mode.allocatedWidth ?? 300;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

        return React.createElement(FluentBreadcrumbComponent, {
            items: items,
            onItemSelect: this.handleItemSelect,
            containerWidth: containerWidth,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
        });
    }

    public getOutputs(): IOutputs {
        return {
            Selected: this.selectedKey
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
