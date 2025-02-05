const SidebarMain = () => {
  return (
    <div className="sidebar-main" style={{ msOverflowStyle: "none" }}>
      <h4 className="sidebar-main-title" style={{}}>
        Discover
      </h4>
    </div>
  );
};

export { SidebarMain };

/*
  {chartSideBarItems.map((category, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
          }
        >
          <h5
            style={{
              marginBottom: "10px",
              color: "#333",
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
              paddingBottom: "5px",
            }}
          >
            {category.title}
          </h5>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {category.charts.map((chart) => {
              const isSelected = selectedCharts.some((c) => c.id === chart.id);
              return (
                <li key={chart.id}>
                  <div
                    style={{
                      margin: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: isSelected
                        ? "2px solid #1B84FF"
                        : "1px solid #eee",
                      borderRadius: "6px",
                      padding: "10px",
                      background: isSelected ? "#e8f5e9" : "#f9f9f9",
                      boxShadow: isSelected ? "0 0 3px #1B99AA" : "none",
                      transition: "all 0.3s",
                    }}
                    onClick={() => toggleChart(chart.id, chart.type)}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: isSelected ? "#1B84FF" : "#555",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {chart.title}
                    </span>
                    
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
*/
