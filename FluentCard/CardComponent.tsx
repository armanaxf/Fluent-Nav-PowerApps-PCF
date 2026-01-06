import * as React from "react";
import {
    Card,
    CardHeader,
    CardPreview,
    CardFooter,
    Text,
    Button,
    Checkbox,
    CheckboxOnChangeData,
    makeStyles,
    tokens,
    FluentProvider,
    webLightTheme,
    Theme,
    mergeClasses,
} from "@fluentui/react-components";

export type CardAppearance = "filled" | "filled-alternative" | "outline" | "subtle";

export interface FluentCardProps {
    title: string;
    subtitle?: string;
    bodyContent?: string;
    image?: string;
    size: "small" | "medium" | "large";
    orientation: "vertical" | "horizontal";
    appearance: CardAppearance;
    selectable: boolean;
    floatingAction: boolean;
    actionButtonText?: string;
    selected: boolean;
    onSelect: (selected: boolean) => void;
    onCardClick: () => void;
    onActionClick: () => void;
    theme?: Theme;
}

// Placeholder SVG for when no image is provided
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
const ERROR_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23f5f5f5' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%23999999'%3EImage Error%3C/text%3E%3C/svg%3E";

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    card: {
        width: "100%",
        height: "100%",
    },
    horizontalCard: {
        display: "flex",
        flexDirection: "row",
    },
    // Size-based padding
    cardSmall: {
        padding: "8px",
    },
    cardMedium: {
        padding: "12px",
    },
    cardLarge: {
        padding: "16px",
    },
    preview: {
        backgroundColor: tokens.colorNeutralBackground3,
        minHeight: "120px",
    },
    previewImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        minHeight: "120px",
    },
    horizontalPreview: {
        width: "140px",
        minWidth: "140px",
        minHeight: "100%",
    },
    // Content container with proper gaps
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: "8px",
        padding: "12px",
    },
    contentContainerSmall: {
        gap: "4px",
        padding: "8px",
    },
    contentContainerLarge: {
        gap: "12px",
        padding: "16px",
    },
    body: {
        // Body text styling
    },
    footer: {
        marginTop: "auto",
        paddingTop: "8px",
    },
    caption: {
        color: tokens.colorNeutralForeground3,
    },
    checkbox: {
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 1,
    }
});

export const FluentCardComponent: React.FC<FluentCardProps> = (props) => {
    const {
        title,
        subtitle,
        bodyContent,
        image,
        size,
        orientation,
        appearance,
        selectable,
        floatingAction,
        actionButtonText,
        selected,
        onSelect,
        onCardClick,
        onActionClick,
        theme,
    } = props;

    const styles = useStyles();

    const handleClick = React.useCallback(() => {
        onCardClick();
        if (selectable && !floatingAction) {
            onSelect(!selected);
        }
    }, [onCardClick, selectable, floatingAction, selected, onSelect]);

    const handleActionClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onActionClick();
    }, [onActionClick]);

    const handleCheckboxChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
        e.stopPropagation();
        onSelect(!!data.checked);
    }, [onSelect]);

    const isHorizontal = orientation === "horizontal";
    const appliedTheme = theme ?? webLightTheme;

    // Determine content container classes based on size
    const contentContainerClass = mergeClasses(
        styles.contentContainer,
        size === "small" && styles.contentContainerSmall,
        size === "large" && styles.contentContainerLarge
    );

    // Use provided image, or placeholder if none
    const imageSrc = image ?? PLACEHOLDER_IMAGE;

    return (
        <FluentProvider theme={appliedTheme} style={{ background: "transparent", width: "100%", height: "100%" }}>
            <div className={styles.root}>
                <Card
                    appearance={appearance}
                    className={mergeClasses(
                        isHorizontal ? styles.horizontalCard : styles.card,
                        size === "small" && styles.cardSmall,
                        size === "medium" && styles.cardMedium,
                        size === "large" && styles.cardLarge
                    )}
                    selected={selectable ? selected : undefined}
                    onSelectionChange={selectable && !floatingAction ? (_, data) => onSelect(data.selected) : undefined}
                    onClick={handleClick}
                    size={size === "small" ? "small" : "medium"}
                >
                    {selectable && floatingAction && (
                        <div className={styles.checkbox}>
                            <Checkbox
                                checked={selected}
                                onChange={handleCheckboxChange}
                                size="large"
                            />
                        </div>
                    )}

                    <CardPreview className={isHorizontal ? styles.horizontalPreview : styles.preview}>
                        <img
                            src={imageSrc}
                            alt={title}
                            className={styles.previewImage}
                            onError={(e) => {
                                // Use fallback placeholder on error
                                (e.target as HTMLImageElement).src = ERROR_IMAGE;
                            }}
                        />
                    </CardPreview>

                    <div className={contentContainerClass}>
                        <CardHeader
                            header={<Text weight="semibold">{title}</Text>}
                            description={subtitle ? <Text size={200} className={styles.caption}>{subtitle}</Text> : undefined}
                        />

                        {bodyContent && (
                            <div className={styles.body}>
                                <Text>{bodyContent}</Text>
                            </div>
                        )}

                        {actionButtonText && (
                            <CardFooter className={styles.footer}>
                                <Button appearance="primary" onClick={handleActionClick}>
                                    {actionButtonText}
                                </Button>
                            </CardFooter>
                        )}
                    </div>
                </Card>
            </div>
        </FluentProvider>
    );
};
