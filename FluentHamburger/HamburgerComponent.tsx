import * as React from 'react';
import {
    FluentProvider,
    webLightTheme,
    Button,
    Tooltip,
    makeStyles,
} from '@fluentui/react-components';
import { Navigation20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    button: {
        minWidth: '32px',
        minHeight: '32px',
    },
});

export interface IHamburgerComponentProps {
    onSelect: () => void;
    tooltip?: string;
    theme?: typeof webLightTheme;
}

export const HamburgerComponent: React.FC<IHamburgerComponentProps> = (props) => {
    const { onSelect, tooltip, theme } = props;
    const styles = useStyles();
    const appliedTheme = theme ?? webLightTheme;
    const tooltipText = tooltip ?? 'Toggle navigation';

    return (
        <FluentProvider theme={appliedTheme}>
            <div className={styles.root}>
                <Tooltip content={tooltipText} relationship="label">
                    <Button
                        appearance="subtle"
                        icon={<Navigation20Regular />}
                        onClick={onSelect}
                        className={styles.button}
                        aria-label={tooltipText}
                    />
                </Tooltip>
            </div>
        </FluentProvider>
    );
};

export default HamburgerComponent;
