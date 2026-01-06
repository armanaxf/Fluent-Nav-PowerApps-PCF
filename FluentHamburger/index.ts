import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import { HamburgerComponent } from './HamburgerComponent';

export class FluentHamburger implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;

    constructor() {
        // Empty constructor
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
    ): void {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;

        // Get theme from Fluent Design Language if available
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const theme = (context as any).fluentDesignLanguage?.tokenTheme;
        const tooltip = context.parameters.Tooltip?.raw ?? undefined;

        return React.createElement(HamburgerComponent, {
            onSelect: this.handleSelect.bind(this),
            tooltip: tooltip,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            theme: theme,
        });
    }

    private handleSelect(): void {
        // Trigger the OnSelect event
        if (this.context.events) {
            this.context.events.triggerEvent('OnSelect');
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup
    }
}
