import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ComputerDetails } from "../../types/assetsTypes";
import { BackButton } from "../../components/form/backButton";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { ComputerInfoComponent } from "../../components/assets-details/computerInfo";
import { ComputerTabsComponent } from "../../components/assets-details/computerTabs";
import { GetAssetsAPI } from "../../config/ApiCalls";
import { useAtom } from "jotai";
import { selectedComputerInfoAtom } from "../../atoms/assets-atoms/assetAtoms";
import { CircularSpinner } from "../../components/spinners/circularSpinner";

const ComputerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comp, setComp] = useState<ComputerDetails | null>(null);
  const [selectedComputerInfo, setSelectedComputerInfo] = useAtom(
    selectedComputerInfoAtom
  );
  const [loading, setLoading] = useState<boolean>(true);
  const devRef = useRef<HTMLDivElement>(null);
  const [devHeight, setDevHeight] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/assets");
      return;
    }

    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          computer_id: id ? [Number(id)] : undefined,
        };

        const response = await GetAssetsAPI(filters);
        if (response.status === 200 && response.data.data?.[0]) {
          setComp(response.data.data[0]);
          setSelectedComputerInfo(response.data.data[0]);
        } else {
          navigate("/assets");
        }
      } catch (err) {
        setError("Failed to load asset data");
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, navigate]);

  useEffect(() => {
    if (devRef.current) {
      setDevHeight(devRef.current.offsetHeight);
    }
  }, [comp]);

  if (loading) {
    return (
      <div className="mt-5 d-flex justify-content-center h-100 align-items-center">
        <CircularSpinner />
      </div>
    );
  }

  if (!comp) {
    return null;
  }

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div className="col-12 p-0">
            <div ref={devRef}>
              <div>
                <BackButton
                  navigateFrom={`assets/asset-details/computer/${id}`}
                  navigateTo={"assets"}
                />
              </div>
              <ComputerInfoComponent compData={comp} />
            </div>

            <div className="col-12 pe-5 ps-5">
              <ComputerTabsComponent devHeight={devHeight} compData={comp} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

const ComputerDetailsPageWrapper = () => {
  return <ComputerDetailsPage />;
};

export { ComputerDetailsPageWrapper };
