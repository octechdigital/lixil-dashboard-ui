/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Header from "../../components/header/Header";
import ViewButtonRenderer from "../../components/customElements/Buttons";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";

const pendingColumnDefs = [
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
