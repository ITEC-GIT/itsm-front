import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssetDetails } from "../../types/assetsTypes";
import { AssetInfoComponent } from "../../components/assets-details/assetInfo";
import { AssetTabsComponent } from "../../components/assets-details/assetTabs";
import { BackButton } from "../../components/form/backButton";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";

const mockAssetDetailsData: { [key: string]: AssetDetails } = {
  "10": {
    id: "10",
    name: "Server-Alpha",
    entity: "IT Department",
    serial_number: "SN-12345",
    model: "Dell PowerEdge R740",
    location: "Data Center A",
    component_processor: "Intel Xeon Gold 6130",
    last_update: "2023-11-15",
    type: "Server",
    project: "Project Phoenix",
    address: "192.168.1.10",
    inventory_number: "INV-001",
    alternate_username_number: "ALT-001",
    status: "Active",
    public_ip: "203.0.113.5",
    tags: ["critical", "production", "database"],
    history: [
      { date: "2023-11-15", action: "Deployed", user: "admin" },
      { date: "2023-11-10", action: "Configuration Updated", user: "user1" },
    ],
  },
  "2": {
    id: "2",
    name: "Laptop-Beta",
    entity: "Marketing",
    serial_number: "SN-67890",
    model: "MacBook Pro",
    location: "Office B",
    component_processor: "Apple M1 Pro",
    last_update: "2023-11-18",
    type: "Laptop",
    project: "Marketing Campaign",
    address: "192.168.1.20",
    inventory_number: "INV-002",
    alternate_username_number: "ALT-002",
    status: "Active",
    public_ip: "203.0.113.6",
    tags: ["portable", "design"],
    history: [{ date: "2023-11-18", action: "Assigned", user: "user2" }],
  },
  // ... more assets
};

const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const devRef = useRef<HTMLDivElement>(null);
  const [devHeight, setDevHeight] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      const data = mockAssetDetailsData[id as string];
      if (data) {
        setAsset(data);
      } else {
        navigate("/assets");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  useEffect(() => {
    if (devRef.current) {
      setDevHeight(devRef.current.offsetHeight);
    }
  }, [asset]);

  if (loading) {
    return (
      <div className="mt-5 d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!asset) {
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
                  navigateFrom={`assets/${id}`}
                  navigateTo={"assets"}
                />
              </div>
              <AssetInfoComponent />
            </div>

            <div className="col-12 pe-5 ps-5">
              <AssetTabsComponent devHeight={devHeight} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { AssetDetailsPage };
