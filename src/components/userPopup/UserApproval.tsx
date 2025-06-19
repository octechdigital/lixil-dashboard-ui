/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CancelIcon from "@mui/icons-material/Cancel";
import { getMediaTypeFromSrc, showToast } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  setIsHeaderRefreshed,
  setIsRefreshed,
} from "../../store/slices/userSlice";
import { GenericRecord } from "../../interface/api";
import API from "../../api";
import { ThemeProvider } from "@emotion/react";
import { useAppSelector } from "../../store/hooks";
import { muiTheme } from "../../lib/style";
import DownloadIcon from "@mui/icons-material/Download";

interface UserApprovalProps {
  open: boolean;
  onClose: () => void;
  mediaSrc: string;
  userData: GenericRecord;
  pageType: "pendingPage" | "rejectedPage" | "approvePage";
  invoiceId: number;
}

const UserApproval: React.FC<UserApprovalProps> = ({
  open,
  onClose,
  mediaSrc,
  userData,
  pageType,
  invoiceId,
}) => {
  const mediaType = getMediaTypeFromSrc(mediaSrc);
  const [selectedAction, setSelectedAction] = useState<
    "approve" | "reject" | ""
  >("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonList, setRejectionReasonList] = useState<any[]>();
  const [customRejectionReason, setCustomRejectionReason] = useState("");
  const [customApprovalReason, setCustomApprovalReason] = useState("");
  const [approvalReasonList, setApprovalReasonList] = useState<any[]>();
  const [selectedApprovalReason, setSelectedApprovalReason] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const isHeaderRefresh = useAppSelector((state) => state.user.isHeaderRefresh);
  const showApproveReasonDropdown = userData.isApproveReason;
  const approvalReasonLabel = userData.approveReasonTitle;
  const excludedUserFields = [
    "url",
    "isApproveReason",
    "approveReasonTitle",
    "invoiceFileUrl",
    "invoiceId",
    "createdDate"
  ];

  useEffect(() => {
    if (selectedAction === "reject") {
      API.getRejectReasonData()
        .then((res) => setRejectionReasonList(res.data))
        .catch((e) => console.log(e));
    }
    if (selectedAction === "approve") {
      if (showApproveReasonDropdown) {
        API.getApproveReasonData()
          .then((res) => setApprovalReasonList(res.data))
          .catch((e) => console.log(e));
      }
    }
  }, [selectedAction, showApproveReasonDropdown]);

  const finishInteraction = () => {
    setSelectedAction("");
    setRejectionReason("");
    setCustomRejectionReason("");
    setCustomApprovalReason("");
    setSelectedApprovalReason("");
    onClose();
  };

  const closeModal = () => finishInteraction();

  const handleApprove = (reason?: string) => {
    const payload: Record<string, string> = {};
    if (reason) payload.approveReason = reason;
    API.userAction("approve", invoiceId, payload)
      .then(() => {
        finishInteraction();
        dispatch(setIsRefreshed(true));
        dispatch(setIsHeaderRefreshed(!isHeaderRefresh));
        showToast("success", "User approved successfully !");
      })
      .catch(console.log);
  };

  const handleReject = (finalReason: string) => {
    API.userAction("reject", invoiceId, { rejectedReason: finalReason })
      .then(() => {
        finishInteraction();
        dispatch(setIsRefreshed(true));
        dispatch(setIsHeaderRefreshed(!isHeaderRefresh));
        showToast("success", "User rejected successfully !");
      })
      .catch(console.log);
  };

  const handleReview = () => {
    API.userAction("review", invoiceId)
      .then(() => {
        finishInteraction();
        dispatch(setIsRefreshed(true));
        dispatch(setIsHeaderRefreshed(!isHeaderRefresh));
        showToast("success", "User moved to pending section !");
      })
      .catch(console.log);
  };

  const handleDownload = async (src: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Media-File";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const renderMedia = () => {
    const style = {
      width: "100%",
      height: "100%",
      maxHeight: "100%",
      objectFit: "contain" as const,
      borderRadius: 8,
    };

    switch (mediaType) {
      case "image":
        return <img src={mediaSrc} alt="Preview" style={style} />;
      case "pdf":
        return (
          <iframe
            src={mediaSrc}
            title="PDF Preview"
            style={{ ...style, border: "none" }}
          />
        );
      case "video":
        return <video src={mediaSrc} controls style={style} />;
      default:
        return null;
    }
  };


  interface InvoiceData {
  architectName: string;
  architectMobile: string;
  salesPersonName: string;
  salesPersonMobile: string;
  invoiceDate: string;
  invoiceNumber: string;
  invoiceValue: number;
  dealerName: string;
  dealerCode: string;
}

// A helper function to map camelCase keys to human-readable labels
const formatLabelMap: Record<keyof InvoiceData, string> = {
  architectName: "Architect Name",
  architectMobile: "Architect Mobile",
  salesPersonName: "Salesperson Name",
  salesPersonMobile: "Salesperson Mobile",
  invoiceDate: "Invoice Date",
  invoiceNumber: "Invoice Number",
  invoiceValue: "Invoice Value",
  dealerName: "Dealer Name",
  dealerCode: "Dealer Code",
};

const formatLabel = (key: keyof InvoiceData): string => {
  return formatLabelMap[key];
};



  return (
    <ThemeProvider theme={muiTheme}>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            finishInteraction();
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            onClick={closeModal}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          >
            <CancelIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
          >
            User Details
          </Typography>

          <Grid container spacing={2}>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ borderRadius: ".5rem", boxShadow: 3 }}
            >
              <Box height={400}>{renderMedia()}</Box>
              <Box
                display="flex"
                justifyContent="right   "
                alignItems="center"
                height={50}
                sx={{
                  // backgroundColor: "#f5f5f5",
                  borderRadius: "0 0 .5rem .5rem",
                }}
              >
                <IconButton
                  onClick={() =>
                    handleDownload(mediaType === "video" ? mediaSrc : mediaSrc)
                  }
                  sx={{
                    position: "relative",
                    bottom: 8,
                    right: 8,
                    zIndex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    transition: "transform 0.3s ease, color 0.3s ease",

                    "&:hover": {
                      backgroundColor: "rgba(231, 231, 231, 0.9)",
                      transform: "scale(1.2)", // increase icon size
                      color: "blue", // change icon color
                    },

                    "& svg": {
                      transition: "color 0.3s ease",
                    },
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ p: 2, borderRadius: ".5rem", boxShadow: 3 }}
            >
              <Box mb={1} display="flex" flexWrap="wrap">
                {Object.entries(userData)
                  .filter(([key]) => !excludedUserFields.includes(key))
                  .map(([key, value]) => (
                    <Box key={key} sx={{ flex: "1 1 calc(50% - 16px)" }}>
                      <Typography variant="body2" gutterBottom key={key}>
                        <strong style={{ textTransform: "capitalize" }}>
                          {(
                            Object.prototype.hasOwnProperty.call(
                              formatLabelMap,
                              key
                            )
                              ? formatLabel(key as keyof InvoiceData)
                              : key
                          )}:
                        </strong>{" "}
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
              </Box>

              {pageType !== "approvePage" && pageType === "pendingPage" && (
                <>
                  <Box mt={2}>
                    <Typography fontWeight="bold">Action</Typography>
                    <RadioGroup
                      row
                      value={selectedAction}
                      onChange={(e) => {
                        setSelectedAction(
                          e.target.value as "approve" | "reject"
                        );
                        setRejectionReason("");
                      }}
                    >
                      <FormControlLabel
                        value="approve"
                        control={<Radio />}
                        label="Approve"
                      />
                      <FormControlLabel
                        value="reject"
                        control={<Radio />}
                        label="Reject"
                      />
                    </RadioGroup>
                  </Box>

                  {selectedAction === "approve" && (
                    <>
                      {showApproveReasonDropdown && (
                        <>
                          <Box mt={2}>
                            <TextField
                              select
                              fullWidth
                              label={approvalReasonLabel as string}
                              value={selectedApprovalReason}
                              onChange={(e) =>
                                setSelectedApprovalReason(e.target.value)
                              }
                            >
                              {approvalReasonList?.map((option, index) => (
                                <MenuItem key={index} value={option.reason}>
                                  {option.reason}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Box>

                          {selectedApprovalReason === "Others" && (
                            <Box mt={1}>
                              <TextField
                                fullWidth
                                label="Enter your reason"
                                value={customApprovalReason}
                                onChange={(e) =>
                                  setCustomApprovalReason(e.target.value)
                                }
                                multiline
                                minRows={1}
                                maxRows={3}
                              />
                            </Box>
                          )}
                        </>
                      )}

                      <Box mt={2}>
                        <Typography>
                          Are you sure you want to approve?
                        </Typography>
                        <DialogActions>
                          <Button onClick={closeModal}>Cancel</Button>
                          <Button
                            onClick={() =>
                              handleApprove(
                                selectedApprovalReason === "Others"
                                  ? customApprovalReason
                                  : selectedApprovalReason
                              )
                            }
                            variant="contained"
                            color="primary"
                            disabled={
                              showApproveReasonDropdown
                                ? !selectedApprovalReason ||
                                  (selectedApprovalReason === "Others" &&
                                    !customApprovalReason.trim())
                                : false
                            }
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Box>
                    </>
                  )}

                  {selectedAction === "reject" && (
                    <Box mt={2}>
                      <TextField
                        select
                        fullWidth
                        label="Rejection Reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      >
                        {rejectionReasonList?.map((option, index) => (
                          <MenuItem key={index} value={option.reason}>
                            {option.reason}
                          </MenuItem>
                        ))}
                      </TextField>

                      {rejectionReason === "Others" && (
                        <Box mt={1}>
                          <TextField
                            fullWidth
                            label="Enter your reason"
                            value={customRejectionReason}
                            onChange={(e) =>
                              setCustomRejectionReason(e.target.value)
                            }
                            multiline
                            minRows={1}
                            maxRows={3}
                          />
                        </Box>
                      )}

                      <DialogActions>
                        <Button onClick={closeModal}>Cancel</Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleReject(
                              rejectionReason === "Others"
                                ? customRejectionReason
                                : rejectionReason
                            )
                          }
                          disabled={
                            rejectionReason === "Others" &&
                            !customRejectionReason.trim()
                          }
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </Box>
                  )}
                </>
              )}

              {pageType === "rejectedPage" && (
                <Box mt={2}>
                  <Typography>Are you sure you want to review?</Typography>
                  <DialogActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button
                      onClick={handleReview}
                      variant="contained"
                      color="primary"
                    >
                      Review
                    </Button>
                  </DialogActions>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default UserApproval;
