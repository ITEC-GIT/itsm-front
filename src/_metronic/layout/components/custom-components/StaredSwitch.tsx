import { useState } from "react";
import { motion } from "framer-motion";

interface StarredToggleProps {
    isStarred: boolean;
    onToggle: (value: boolean) => void;
}

const StarredToggle: React.FC<StarredToggleProps> = ({ isStarred, onToggle }) => {
    return (
        <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => onToggle(!isStarred)}
        >
            <div
                className="d-flex align-items-center"
                style={{
                    width: "70px",
                    height: "35px",
                    backgroundColor: isStarred ? "#fbc02d" : "#6c757d",
                    borderRadius: "50px",
                    padding: "5px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <motion.div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        left: isStarred ? "calc(100% - 30px)" : "5px",
                    }}
                    animate={{
                        left: isStarred ? "calc(100% - 30px)" : "5px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <i className={`fa ${isStarred ? "fa-star" : "fa-star-o"}`} style={{ color: isStarred ? "#fbc02d" : "#6c757d" }} />
                </motion.div>
            </div>
            <motion.span
                className="ms-2"
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                style={{ fontWeight: "bold", color: isStarred ? "#fbc02d" : "#6c757d" }}
            >
                {isStarred ? "Starred On" : "Starred Off"}
            </motion.span>
        </div>
    );
};

export default StarredToggle;
