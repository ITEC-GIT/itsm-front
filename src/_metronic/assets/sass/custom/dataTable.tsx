export const customStyles = {
  headRow: {
    style: {
      background: "var(--blue-gradient)",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      paddingLeft: "5px",
    },
  },

  headCells: {
    style: {
      paddingLeft: "5px",
      paddingRight: "5px",
    },
  },

  rows: {
    style: {
      minHeight: "50px",
      paddingLeft: "5px",
    },
  },

  cells: {
    style: {
      paddingLeft: "5px",
      paddingRight: "5px",
    },
  },
  pagination: {
    style: {
      background: "var(--blue-gradient)",
      color: "white",
      borderTop: "1px solid #e0e0e0",
    },
    pageButtonsStyle: {
      color: "white",
      fill: "white",
      background: "transparent",
      border: "1px solid white",
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      margin: "0 5px",
      "&:hover:not(:disabled)": {
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.2)",
      },
      "&:focus": {
        outline: "none",
      },
    },
  },
};
