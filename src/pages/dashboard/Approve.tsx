import React from "react";
import Header from "../../components/header/Header";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";
import ViewButtonRenderer from "../../components/customElements/Buttons";

const approvedColumnDefs = [
  { headerName: "Sales Mobile", field: "mobile" },
  { headerName: "Saler Name", field: "name" },
  { headerName: "Architect Name", field: "name" },
  { headerName: "Client Name", field: "name" },
  { headerName: "Clinet Mobile", field: "mobile" },
  { headerName: "Dealer Name", field: "name" },
  { headerName: "Site Address", field: "state" },
  { headerName: "invoice Number", field: "winAmount" },
  { headerName: "invoice Value", field: "winAmount" },
  { headerName: "Moderated By", field: "moderated_by" },
  { headerName: "Date", field: "date" },
  {
    field: "view",
    headerName: "View",
    cellRenderer: (params: any) => (
      <ViewButtonRenderer pageType="approvePage" props={params} />
    ),
  },
];

const Approve: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  return (
    <>
      <Header />
      <GenericAgGrid
        title="Approved Overview"
        columnDefs={approvedColumnDefs}
        fetchData={API.getApproveData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="approved" shouldPlay={true} />}
      />
    </>
  );
};

export default Approve;
