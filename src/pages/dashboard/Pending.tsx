import React from "react";
import Header from "../../components/header/Header";
import ViewButtonRenderer from "../../components/customElements/Buttons";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";

const pendingColumnDefs = [
  { headerName: "Sales Mobile", field: "mobile" },
  { headerName: "Saler Name", field: "name" },
  { headerName: "Architect Name", field: "name" },
  { headerName: "Client Name", field: "name" },
  { headerName: "Clinet Mobile", field: "mobile" },
  { headerName: "Dealer Name", field: "name" },
  { headerName: "Site Address", field: "state" },
  { headerName: "invoice Number", field: "winAmount" },
  { headerName: "invoice Value", field: "winAmount" },
  { headerName: "Date", field: "date" },
  {
    field: "view",
    headerName: "View",
    cellRenderer: (params: any) => (
      <ViewButtonRenderer pageType="pendingPage" props={params} />
    ),
  },
];

const Pending: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);

  return (
    <>
      <Header />
      <GenericAgGrid
        title="Pending Overview"
        columnDefs={pendingColumnDefs}
        fetchData={API.getPendingData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="pending" shouldPlay={true} />}
      />
    </>
  );
};

export default Pending;
