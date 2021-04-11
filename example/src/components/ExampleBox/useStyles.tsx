import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(
    createStyles({
        container: {
            position: "relative",
            fontSize: "1rem",
            lineHeight: "1.1rem",
            padding: (props: { expanded: boolean }) => (props.expanded ? "1.8rem 1.5rem 1.5rem 1.5rem" : "3rem 0 0 0"),
            borderRadius: "0.3rem",
            marginTop: "2rem",
        },
        exampleLabel: {
            color: "#FFE2D7",
            top: "-1.4rem",
            position: "absolute",
            fontSize: (props: { expanded: boolean }) => (props.expanded ? "1.2rem" : "1.4rem"),
            lineHeight: "1rem",
            backgroundColor: "#F24F00",
            padding: (props: { expanded: boolean }) => (props.expanded ? "0.9rem 1.2rem" : "1.5rem 1.9rem"),
            borderRadius: "0.3rem",
            cursor: "pointer",
            userSelect: "none",
        },
    })
);
 

export default useStyles;