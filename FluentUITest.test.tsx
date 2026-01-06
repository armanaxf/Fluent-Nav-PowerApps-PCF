import * as React from 'react';
import { render } from '@testing-library/react';
import { Button, FluentProvider, webLightTheme, MessageBar, MessageBarBody } from '@fluentui/react-components';

describe('Fluent UI integration', () => {
    it('renders a button', () => {
        const { getByText } = render(
            <FluentProvider theme={webLightTheme}>
                <Button>Test Button</Button>
            </FluentProvider>
        );
        expect(getByText('Test Button')).toBeInTheDocument();
    });
});
