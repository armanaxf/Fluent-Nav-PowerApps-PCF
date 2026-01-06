import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentNavComponent, NavItemData } from "./NavComponent";
import * as React from "react";

export class FluentNav implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedKey = "";
    private isOpen = true;
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

    private mapDatasetToNavItems(context: ComponentFramework.Context<IInputs>): NavItemData[] {
        const dataset = context.parameters.navItems;
        const items: NavItemData[] = [];

        if (!dataset?.sortedRecordIds || dataset.sortedRecordIds.length === 0) {
            return [
                { key: "home", name: "Home", icon: "Home" },
                { key: "dashboard", name: "Dashboard", icon: "Grid" },
                { key: "documents", name: "Documents", icon: "Document" },
                { key: "doc1", name: "Reports", icon: "Document", parentKey: "documents" },
                { key: "doc2", name: "Templates", icon: "Document", parentKey: "documents" },
                { key: "settings", name: "Settings", icon: "Settings" },
            ];
        }

        for (const recordId of dataset.sortedRecordIds) {
            const record = dataset.records[recordId];
            const itemKey = (record.getValue("ItemKey") as string) ?? recordId;
            const itemName = (record.getValue("ItemName") as string) ?? "";
            const itemIcon = record.getValue("ItemIcon") as string | undefined;
            const itemParentKey = record.getValue("ItemParentKey") as string | undefined;

            items.push({
                key: itemKey,
                name: itemName,
                icon: itemIcon ?? undefined,
                parentKey: itemParentKey ?? undefined,
            });
        }

        return items;
    }

    private handleSelectionChange = (newSelectedKey: string): void => {
        this.selectedKey = newSelectedKey;
        this.notifyOutputChanged();
        // Fire the OnNavItemSelect event
        if (this.context.events?.OnNavItemSelect) {
            this.context.events.OnNavItemSelect();
        }
    };

    private handleOpenChange = (newIsOpen: boolean): void => {
        this.isOpen = newIsOpen;
        this.notifyOutputChanged();
        // Fire the OnToggle event
        if (this.context.events?.OnToggle) {
            this.context.events.OnToggle();
        }
    };

    private handleHeaderSelect = (): void => {
        // Fire the OnHeaderSelect event
        if (this.context.events?.OnHeaderSelect) {
            this.context.events.OnHeaderSelect();
        }
    };

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;

        const navItems = this.mapDatasetToNavItems(context);
        const defaultSelectedKey = context.parameters.DefaultSelectedKey?.raw ?? undefined;
        const headerTitle = context.parameters.HeaderTitle?.raw ?? undefined;
        const headerIcon = context.parameters.HeaderIcon?.raw ?? undefined;
        const headerImageUrl = context.parameters.HeaderImageUrl?.raw ?? undefined;

        // Get theme from fluentDesignLanguage if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

        return React.createElement(FluentNavComponent, {
            items: navItems,
            selectedKey: this.selectedKey ? this.selectedKey : undefined,
            defaultSelectedKey: defaultSelectedKey,
            onSelectionChange: this.handleSelectionChange,
            onOpenChange: this.handleOpenChange,
            onHeaderSelect: this.handleHeaderSelect,
            headerTitle: headerTitle,
            headerIcon: headerIcon,
            headerImageUrl: headerImageUrl,
            isOpen: this.isOpen,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: fluentTheme,
        });
    }

    public getOutputs(): IOutputs {
        return {
            SelectedKey: this.selectedKey,
            IsOpen: this.isOpen,
        };
    }

    public destroy(): void {
        // Cleanup if necessary
    }
}
