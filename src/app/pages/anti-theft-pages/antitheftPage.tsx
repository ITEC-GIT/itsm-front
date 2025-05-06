import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar/ToolbarWrapper";
import { useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content/Content";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { actions } from "../../data/antitheft.tsx";

const AntiTheftPage: FC = () => {
  const navigate = useNavigate();
  const handleClick = (action: any) => {
    navigate(`/antitheft/${action}`);
  };
  return (
    <>
      <ToolbarWrapper source="Anti Theft" />

      <Content>
        <div className="container hyper-container py-5">
          <div className="row hyper-row g-4 d-flex justify-content-center">
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

const AntiTheftWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <AnimatedRouteWrapper>
        <PageTitle breadcrumbs={[]}>Anti Theft</PageTitle>
        <AntiTheftPage />
      </AnimatedRouteWrapper>
    </>
  );
};

export { AntiTheftWrapper };
