import React, { FC, ReactNode, useState } from "react";
import useStyles from "./useStyles";

type ExampleBoxProps = {
    children?: ReactNode;
    defaultExpanded?: boolean;
};

const ExampleBox: FC<ExampleBoxProps> = (props: ExampleBoxProps) => {

    const [expanded, setExpanded] = useState<boolean>(props.defaultExpanded || false);
    const styles = useStyles({ expanded });

    return (
        <div className={styles.container}>
            <span onClick={() => setExpanded(!expanded)} className={styles.exampleLabel}>
                EXAMPLES
            </span>
            {expanded && props.children}
        </div>
    );
};

export default ExampleBox;
