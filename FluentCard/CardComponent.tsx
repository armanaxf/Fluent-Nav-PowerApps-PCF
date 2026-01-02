import * as React from "react";
import {
    Card,
    CardHeader,
    CardPreview,
    Text,
    makeStyles,
    tokens,
} from "@fluentui/react-components";

export interface FluentCardProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    size: "small" | "medium" | "large";
    orientation: "vertical" | "horizontal";
    selectable: boolean;
    selected: boolean;
    onSelect: (selected: boolean) => void;
    onClick: () => void;
}

const useStyles = makeStyles({
    card: {
        width: "100%",
        height: "100%",
    },
    cardSmall: {
        maxWidth: "200px",
    },
    cardMedium: {
        maxWidth: "300px",
    },
    cardLarge: {
        maxWidth: "400px",
    },
    horizontalCard: {
        display: "flex",
        flexDirection: "row",
    },
    preview: {
        backgroundColor: tokens.colorNeutralBackground3,
    },
    previewImage: {
        width: "100%",
        height: "auto",
        objectFit: "cover",
    },
    horizontalPreview: {
        width: "120px",
        minWidth: "120px",
    },
});

export const FluentCardComponent: React.FC<FluentCardProps> = (props) => {
    const {
        title,
        subtitle,
        imageUrl,
        size,
        orientation,
        selectable,
        selected,
        onSelect,
        onClick,
    } = props;

    const styles = useStyles();

    const handleClick = React.useCallback(() => {
        onClick();
        if (selectable) {
            onSelect(!selected);
        }
    }, [onClick, selectable, selected, onSelect]);

    // Determine size class
    const sizeClass = size === "small" ? styles.cardSmall
        : size === "large" ? styles.cardLarge
            : styles.cardMedium;

    const cardClassName = `${styles.card} ${sizeClass} ${orientation === "horizontal" ? styles.horizontalCard : ""}`;
    const previewClassName = `${styles.preview} ${orientation === "horizontal" ? styles.horizontalPreview : ""}`;

    return (
        <Card
            className={cardClassName}
            selected={selectable ? selected : undefined}
            onSelectionChange={selectable ? (_, data) => onSelect(data.selected) : undefined}
            onClick={handleClick}
        >
            {imageUrl && (
                <CardPreview className={previewClassName}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.previewImage}
                    />
                </CardPreview>
            )}
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={subtitle ? <Text size={200}>{subtitle}</Text> : undefined}
            />
        </Card>
    );
};
