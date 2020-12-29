import React from "react";
import Modal from "@material-ui/core/Modal";
import TableDisplay from "./TableDisplay";
import { makeStyles } from "@material-ui/core/styles";
import { DetailsPopUpCtx } from "./DetailsPopUpCtx";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 1200,
    backgroundColor: theme.palette.background.paper,
  },
}));

function DetailsPopUpModal() {
  const classes = useStyles();
  const { open, setOpen, data } = React.useContext(DetailsPopUpCtx);
  console.log("data: ", data);

  const modalStyle = {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div style={modalStyle} className={classes.paper}>
        <TableDisplay
          data={{ res: [data.place], count: 1 }}
          visibleColumns={data.nameToKey}
          noPagination
        />
      </div>
    </Modal>
  );
}

export default DetailsPopUpModal;
