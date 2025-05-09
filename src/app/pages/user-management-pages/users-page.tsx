import { useEffect, useMemo, useRef, useState } from "react";
import { SearchComponent } from "../../components/form/search.tsx";
import DataTable, { TableColumn } from "react-data-table-component";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { debounce } from "lodash";
import { UsersColumnsTable } from "../../data/user-management.tsx";
import { customStyles, sortIcon } from "../../data/dataTable.tsx";
import { CreateUserType, UserType } from "../../types/user-management.ts";
import { UserCreationModal } from "../../components/user-management/create-user-model.tsx";
import { DeleteUserAPI, GetAllUsersAPI } from "../../config/ApiCalls.ts";
import { CircularSpinner } from "../../components/spinners/circularSpinner.tsx";

const UsersPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [usersData, setUsersData] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<TableColumn<UserType>[]>(
    []
  );

  const handleSearchChange = debounce((query: string) => {
    setSearchQuery(query);
  }, 100);

  const handleMouseEnter = (rowId: number) => {
    setHoveredRowId(rowId);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
  };

  const toggleModelCreation = () => {
    setSelectedUser(null);
    setIsModalOpen((prevState) => !prevState);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    const deleteUser = await DeleteUserAPI(userId);
    if (deleteUser.status === 200) {
      setUsersData((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    }
  };

  const handleSaveUser = (newOrUpdatedUser: any) => {
    const newUserData: UserType = {
      id: newOrUpdatedUser.id,
      name: newOrUpdatedUser.name,
      username: newOrUpdatedUser.username,
      user_category: newOrUpdatedUser.user_category,
      email: newOrUpdatedUser.email,
      profile_image: newOrUpdatedUser.profile_image,
      phone: newOrUpdatedUser.phone,
      phone2: newOrUpdatedUser.phone2,
      mobile: newOrUpdatedUser.mobile,
      comment: newOrUpdatedUser.comment,

      preferred_name: newOrUpdatedUser.preferred_name,
      roles: newOrUpdatedUser.roles,
      groups: newOrUpdatedUser.groups,
      department: newOrUpdatedUser.departments_id,
      location: newOrUpdatedUser.locations_id,
      title: newOrUpdatedUser.user_titles_id,
      isActive: newOrUpdatedUser.is_active,
    };

    setUsersData((prevUsers) => {
      const userIndex = prevUsers.findIndex(
        (user) => user.id === newUserData.id
      );

      if (userIndex !== -1) {
        const updatedUsers = [...prevUsers];
        updatedUsers[userIndex] = newUserData;
        return updatedUsers;
      } else {
        return [newUserData, ...prevUsers];
      }
    });
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsersData = useMemo(() => {
    return usersData.filter((user) => {
      const query = searchQuery.trim().toLowerCase();
      const roleNames =
        user.roles?.map((role) => role.name.toLowerCase()).join(" ") || "";
      const groupNames =
        user.groups?.map((group) => group?.name.toLowerCase()).join(" ") || "";
      const locationName = user.location?.name?.toLowerCase() || "";
      const departmentName = user.department?.name?.toLowerCase() || "";
      const titleName = user.title?.name?.toLowerCase() || "";

      return (
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        roleNames.includes(query) ||
        groupNames.includes(query) ||
        locationName.includes(query) ||
        departmentName.includes(query) ||
        titleName.includes(query)
      );
    });
  }, [usersData, searchQuery]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const response = await GetAllUsersAPI();
        if (response.status === 200) {
          const data = response.data;
          setUsersData(data);
        }
      } catch (err) {
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]);

  useEffect(() => {
    setVisibleColumns(
      UsersColumnsTable(hoveredRowId, handleEditUser, handleDeleteUser)
    );
  }, [hoveredRowId]);

  useEffect(() => {
    const calculateWidths = () => {
      const columnsWithoutAction = visibleColumns.filter(
        (col) => col.id !== "action" && col.id !== "status"
      );
      const visibleCount = visibleColumns.length;
      const newWidths: Record<string, string> = {};

      if (visibleCount === 2) {
        columnsWithoutAction.forEach((col: TableColumn<UserType>) => {
          newWidths[col.id as string] = "50%";
        });
      } else if (visibleCount > 2) {
        const baseWidthPercentage = Math.ceil(100 / visibleCount);

        if (tableContainerRef.current) {
          const containerWidth = tableContainerRef.current.clientWidth;

          columnsWithoutAction.forEach((col: TableColumn<UserType>) => {
            if (col.width) {
              const pixelWidth = parseInt(col.width, 10);

              if (!isNaN(pixelWidth)) {
                const columnPercentageWidth =
                  Math.round((pixelWidth / containerWidth) * 100) + 0.05;

                if (columnPercentageWidth < baseWidthPercentage) {
                  newWidths[col.id as string] = `${baseWidthPercentage}%`;
                } else {
                  newWidths[col.id as string] = col.width;
                }
              } else {
                newWidths[col.id as string] = `${baseWidthPercentage}%`;
              }
            } else {
              newWidths[col.id as string] = `${baseWidthPercentage}%`;
            }
          });
        }
      }

      setColumnWidths(newWidths);
    };

    calculateWidths();

    const observer = new ResizeObserver(calculateWidths);
    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [visibleColumns]);

  return (
    <AnimatedRouteWrapper>
      <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
        <div className="row d-flex flex-column custom-main-container custom-container-height">
          <div className="d-flex flex-column col-12">
            <div ref={divRef} className="row">
              <div className="col-12 d-flex align-items-center justify-content-between mb-4 ms-2">
                <div className="d-flex justify-content-between gap-3">
                  <div className="symbol symbol-50px ">
                    <h2>👥 Users</h2>
                    <span className="text-muted fs-6">
                      Create and manage users
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end align-items-center mb-3 gap-2">
                <SearchComponent
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  onClick={toggleModelCreation}
                  className="btn text-dark  d-flex align-items-center gap-2 px-4 py-2 custom-btn"
                >
                  <i className="bi bi-plus fs-1 text-dark"></i>
                  <span className="d-none d-sm-inline">Add New User</span>
                </button>
              </div>
            </div>

            <div
              style={{
                height: `calc(100vh - var(--bs-app-header-height) - 40px - ${height}px - 40px)`,
                overflow: "hidden",
              }}
            >
              {loading ? (
                <div className="h-100 d-flex align-items-center justify-content-center my-4">
                  <CircularSpinner />
                </div>
              ) : (
                <div
                  className="p-3"
                  ref={tableContainerRef}
                  style={{
                    flex: 1,
                    // overflow: "auto",
                  }}
                >
                  <DataTable
                    columns={visibleColumns.map((col) => ({
                      ...col,
                      width: columnWidths[col.id as string],
                    }))}
                    data={filteredUsersData}
                    persistTableHead={true}
                    responsive
                    highlightOnHover
                    customStyles={customStyles}
                    sortIcon={sortIcon}
                    onRowMouseEnter={(row) => handleMouseEnter(row.id)}
                    onRowMouseLeave={handleMouseLeave}
                    fixedHeader
                    fixedHeaderScrollHeight={`calc(100vh - var(--bs-app-header-height) - ${height}px - 100px)`}
                  />
                </div>
              )}
            </div>

            {/* <div className="sticky-pagination d-flex justify-content-end align-items-center">
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleFirstPage}
                disabled={currentHistorysPage === 1}
              >
                First
              </button>
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handlePreviousPage}
                disabled={currentHistorysPage === 1}
              >
                Previous
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, index) => startPage + index
              ).map((page) => (
                <button
                  key={page}
                  className={clsx("btn btn-sm me-2", {
                    "btn-primary": currentHistorysPage === page,
                    "btn-light": currentHistorysPage !== page,
                  })}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-sm btn-light me-2"
                onClick={handleNextPage}
                disabled={currentHistorysPage === totalPages}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={handleLastPage}
                disabled={currentHistorysPage === totalPages}
              >
                Last
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UserCreationModal
          show={isModalOpen}
          onClose={toggleModelCreation}
          onSave={handleSaveUser}
          selectedUser={selectedUser}
        />
      )}
    </AnimatedRouteWrapper>
  );
};

const UsersPageWrapper = () => {
  return <UsersPage />;
};

export { UsersPageWrapper };
