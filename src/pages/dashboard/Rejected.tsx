import React from "react";
import Header from "../../components/header/Header";
import ViewButtonRenderer from "../../components/customElements/Buttons";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";

const campaignColumnDefs = [
  { headerName: "Sales Mobile", field: "mobile" },
  { headerName: "Saler Name", field: "name" },
  { headerName: "Architect Name", field: "name" },
  { headerName: "Client Name", field: "name" },
  { headerName: "Clinet Mobile", field: "mobile" },
  { headerName: "Dealer Name", field: "name" },
  { headerName: "Site Address", field: "state" },
  { headerName: "invoice Number", field: "winAmount" },
  { headerName: "invoice Value", field: "winAmount" },
  { headerName: "Win Amount", field: "winAmount" },
  { headerName: "Moderated By", field: "moderated_by" },
  { headerName: "Reason", field: "reason" },
  { headerName: "Date", field: "date" },
  {
      field: "view",
      headerName: "View",
      cellRenderer: (params: any) => (
        <ViewButtonRenderer pageType="approvePage" props={params} />
      ),
    },
  {
    field: "review",
    headerName: "Review",
    cellRenderer: (params: any) => (
      <ViewButtonRenderer pageType="rejectedPage" props={params} />
    ),
  },
];

const Rejected = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  return (
    <>
      <Header />
      <GenericAgGrid
        title="Rejected Overview"
        columnDefs={campaignColumnDefs}
        fetchData={API.getRejectedData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="rejected" shouldPlay={true} />}
      />
    </>
  );
};

export default Rejected;
