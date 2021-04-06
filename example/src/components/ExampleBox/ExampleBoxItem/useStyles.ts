import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(
    createStyles({
        container: {
            borderBottom: "0.1rem solid #363636",
            padding: "1rem",
            "&:last-of-type": {
                borderBottom: "none",
            },
        },
        infoBox: {
            marginTop: "1rem",
            backgroundColor: "#555555",
            padding: "0.5rem",
            border: "0.1rem solid #363636",
            borderRadius: "0.2rem",
            color: "#f2f2f2",
        },
        renderAsLabel: {
            marginBottom: "1rem",
        },
      
    })
);

export default useStyles;