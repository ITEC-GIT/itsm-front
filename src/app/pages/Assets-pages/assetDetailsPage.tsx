import { AssetDetails } from "../../types/assetsTypes";
import { AssetInfoComponent } from "../../components/assets-details/assetInfo";
import { BackButton } from "../../components/form/backButton";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper";
import { GetAssets } from "../../config/ApiCalls";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utils/custom";
import { CircularSpinner } from "../../components/spinners/circularSpinner";

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return " ";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return value;
  }

  return String(value);
};

const AttributeRow: React.FC<{ label: string; value: any }> = ({
  label,
  value,
}) => {
  const isWarrantyExpired =
    label === "warranty_expiration" &&
    typeof value === "string" &&
    new Date(value) < new Date();

  return (
    <div className="mb-3">
      <span className="d-block text-muted medium mb-1">
        {capitalize(label.replace(/_/g, " "))}
      </span>
      <div className="d-flex gap-2 align-items-center">
        <span className="fw-bold text-truncate pe-2">{formatValue(value)}</span>
        <div>
          {isWarrantyExpired && (
            <span className="badge bg-danger text-white">Out of Warranty</span>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetDetailsPage: React.FC = () => {
  const { id, hash } = useParams<{ id?: string; hash?: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "docs">("notes");

  useEffect(() => {
    if (!id && !hash) {
      navigate("/assets");
      return;
    }

    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          asset_id: id ? [Number(id)] : undefined,
          asset_hash: hash ? [hash] : undefined,
        };

        const response = await GetAssets(filters);

        if (response.status === 200 && response.data.data?.[0]) {
          setAsset(response.data.data[0]);
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
  }, [id, hash, navigate]);

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
      <div className="d-flex flex-column custom-main-container custom-container-height">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <CircularSpinner />
          </div>
        ) : (
          <>
            <div className="row p-3">
              <div className="col-12 ">
                <BackButton
                  navigateFrom={`assets/asset-details/${id}/${hash}`}
                  navigateTo={"assets"}
                />
                <AssetInfoComponent assetData={asset} />
              </div>
            </div>
            <div className="row p-3 vertical-scroll none-scroll-width">
              <div className="col-lg-7 col-md-6">
                <div className="card mb-4 border">
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex align-items-center mb-4">
                      <i className="bi bi-database fs-1 text-dark me-3"></i>
                      <h3 className="mb-0">Specifications</h3>
                    </div>

                    {asset?.specific_attributes?.length ? (
                      <div className="row">
                        {asset.specific_attributes.map(
                          (attr: Record<string, any>, i: number) =>
                            Object.entries(attr).map(([key, val]) => (
                              <div
                                className="col-md-6 col-12 mb-3"
                                key={`${key}-${i}`}
                              >
                                <AttributeRow label={key} value={val} />
                              </div>
                            ))
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">
                        No specifications available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-6">
                <div className="card mb-4 border">
                  <div className="card-body p-3 p-md-4">
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex bg-light rounded p-2 mb-4">
                          <button
                            className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${
                              activeTab === "notes"
                                ? "bg-white fw-bold"
                                : "text-muted"
                            }`}
                            onClick={() => setActiveTab("notes")}
                          >
                            <i
                              className={`bi bi-clock-history ${
                                activeTab === "notes"
                                  ? "text-dark"
                                  : "text-muted"
                              }`}
                            ></i>
                            Notes
                          </button>
                          <button
                            className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${
                              activeTab === "docs"
                                ? "bg-white fw-bold"
                                : "text-muted"
                            }`}
                            onClick={() => setActiveTab("docs")}
                          >
                            <i
                              className={`bi bi-clock-history ${
                                activeTab === "docs"
                                  ? "text-dark"
                                  : "text-muted"
                              }`}
                            ></i>
                            Documents
                          </button>
                        </div>
                      </div>
                    </div>

                    {asset?.notes && typeof asset.notes === "object" ? (
                      Object.entries(asset.notes).map(([key, val], i) => (
                        <div className="mb-3" key={`${key}-${i}`}>
                          <AttributeRow label={key} value={val} />
                        </div>
                      ))
                    ) : (
                      <div className="text-muted py-3 text-center">
                        No notes available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AssetDetailsPageWrapper = () => {
  return (
    <AnimatedRouteWrapper>
      <AssetDetailsPage />
    </AnimatedRouteWrapper>
  );
};

export { AssetDetailsPageWrapper };
