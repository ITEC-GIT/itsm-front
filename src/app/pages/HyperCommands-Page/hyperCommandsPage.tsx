import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar/ToolbarWrapper";
import { Content } from "../../../_metronic/layout/components/content/Content";
import { actions } from "../../data/hyperCommands";
import { useNavigate } from "react-router-dom";

const HyperCommandsPage: FC = () => {
  const navigate = useNavigate();
  const handleClick = (action: any) => {
    navigate(`/hyper-commands/${action}`);
  };
  return (
    <>
      <ToolbarWrapper source="Hyper Commands" />

      <Content>
        <div className="container hyper-container py-5">
          <div className="row hyper-row g-4">
            {actions.map((action, index) => (
              <div
                className="col-12 hyper-col col-sm-6 col-lg-3"
                key={index}
                onClick={() => handleClick(action.action)}
              >
                <div className="card h-100 shadow-sm hyper-card">
                  <div className="card-body text-center hyper-card-body">
                    <div className="icon hyper-icon mb-3">
                      <i
                        className={`bi ${action.icon} text-primary`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </div>
                    <h5 className="card-title hyper-card-title">
                      {action.title}
                    </h5>
                    <p className="card-text hyper-card-text">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </>
  );
};

const HyperCommandsWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>Hyper Comamnds</PageTitle>
      <HyperCommandsPage />
    </>
  );
};

export { HyperCommandsWrapper };
