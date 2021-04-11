import React, { FC, ReactNode } from "react";
import { Typography } from "@material-ui/core";
import useStyles from "./useStyles";
import codepaint from "@codepainter/core";

type ExampleBoxItemProps = {
    children?: ReactNode;
    label: string;
};

const ExampleBoxItem: FC<ExampleBoxItemProps> = (props: ExampleBoxItemProps) => {

    const styles = useStyles();

    return (
        <div className={styles.container}>
            {codepaint.parseJsx(props.label)}

            {props.children && (<div className={styles.infoBox}>
                <Typography className={styles.renderAsLabel}>About:</Typography>
                {props.children}
                </div>)
            }
        </div>
    );
};

export default ExampleBoxItem;