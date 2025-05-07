export const sortIcon = (
  <i
    className="fa-solid fa-arrow-up-wide-short"
    style={{
      fontSize: "1rem",
      marginLeft: "5px",
      color: "rgba(0, 0, 0, 0.6)",
    }}
  ></i>
);

export const customStyles = {
  rows: {
    style: {
      fontSize: "14px",
      minHeight: "48px",
      borderBottom: "none !important",
      position: "relative !important" as "relative",
      "&:hover": {
        backgroundColor: "transparent !important",
        width: "100% !important",
        "& td": {
          backgroundColor: "transparent !important",
          width: "100% !important",
        },
      },
    },
  },
  headCells: {
    style: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: "14px",
      fontWeight: "500",
      padding: "5px 5px",
      background: "white",
      borderBottom: "1px solid #dee2e6",
      borderTop: "1px solid #dee2e6",
      paddingLeft: "24px",
    },
  },
  table: {
    style: {
      width: "100% !important",
      // tableLayout: "fixed" as "fixed",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
      borderBottom: "none",
    },
  },
};

export const columnXXXLargeWidth = "210px";
export const columnXXLargeWidth = "180px";
export const columnXLargeWidth = "140px";
export const columnLargeWidth = "120px";
export const columnMediumWidth = "100px";
export const columnSmallWidth = "50px";
