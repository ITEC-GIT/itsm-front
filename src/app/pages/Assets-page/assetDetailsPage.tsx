import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssetDetails } from "../../types/assetsTypes";
import { AssetInfoComponent } from "../../components/assets-details/assetInfo";
import { AssetTabsComponent } from "../../components/assets-details/assetTabs";

const mockAssetDetailsData: { [key: string]: AssetDetails } = {
  "7": {
    id: "7",
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column">
              <AssetInfoComponent />
              <div className="mb-1">
                <hr className="asset-dropdown-divider" />
              </div>
              <AssetTabsComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AssetDetailsPage };
