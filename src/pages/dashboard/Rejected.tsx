/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Header from "../../components/header/Header";
import ViewButtonRenderer from "../../components/customElements/Buttons";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";

const campaignColumnDefs = [
  { headerName: "Sales Mobile", field: "salesPersonMobile" },
  { headerName: "Sales Name", field: "salesPersonName" },
  { headerName: "Architect Mobile", field: "architectMobile" },
  { headerName: "Architect Name", field: "architectName" },
  { headerName: "House No", field: "houseNo" },
  { headerName: "City", field: "city" },
  { headerName: "Area", field: "area" },
  { headerName: "Dealer Name", field: "dealerName" },
  { headerName: "Invoice Value", field: "invoiceValue" },
  { headerName: "Date", field: "createdDate" },
  // { headerName: "Client Name", field: "clientAddress" },
  // { headerName: "Client Mobile", field: "clientNumber" },
  // { headerName: "Dealer Code", field: "dealerCode" },
  // { headerName: "Site Address", field: "siteAddress" },
  // { headerName: "Invoice Number", field: "invoiceNumber" },
  { headerName: "Reason", field: "reason" },
  { headerName: "Date", field: "createdDate" },
  { headerName: "Moderated By", field: "moderated_by" },
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
